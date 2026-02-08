// =============================================================================
// AI Actions — Photo analysis, scope generation, retry
// =============================================================================

import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { callGeminiVision, callGeminiText } from "./lib/gemini";
import {
  photoAnalysisPrompt,
  masterSystemPrompt,
  tradePrompts,
  sequencingPrompt,
  coordinationPrompt,
} from "./lib/prompts";
import {
  determineRequiredTrades,
  parseQualityTier,
  TRADE_META,
  type TradeType,
  type ProjectType,
  type QuestionAnswers,
} from "./lib/trades";
import { validateScope } from "./lib/validation";
import {
  getSequencingTemplate,
  filterTemplatePhasesForTrades,
} from "./lib/sequencing";

// All trades now have prompts — none blocked
const BLOCKED_TRADES = new Set<string>();

// =============================================================================
// Photo Analysis
// =============================================================================

export const analysePhotos = internalAction({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not set");

    // Set status to running
    await ctx.runMutation(internal.projects.updateProjectInternal, {
      projectId: args.projectId,
      updates: { photoAnalysisStatus: "running" },
    });

    try {
      // Get project details
      const project = await ctx.runQuery(
        internal.projects.getProjectInternal,
        { projectId: args.projectId }
      );
      if (!project) throw new Error("Project not found");

      // Get photos with URLs
      const photos = await ctx.runQuery(
        internal.photos.getPhotosByProjectInternal,
        { projectId: args.projectId }
      );

      if (photos.length === 0) {
        await ctx.runMutation(internal.projects.updateProjectInternal, {
          projectId: args.projectId,
          updates: { photoAnalysisStatus: "complete", photoAnalysis: null },
        });
        return;
      }

      // Fetch each photo and convert to base64
      const images: { data: string; mimeType: string }[] = [];
      for (const photo of photos) {
        if (!photo.url) continue;
        try {
          const res = await fetch(photo.url);
          const buf = await res.arrayBuffer();
          const base64 = Buffer.from(buf).toString("base64");
          images.push({ data: base64, mimeType: photo.mimeType });
        } catch (err) {
          console.error(`Failed to fetch photo ${photo._id}:`, err);
        }
      }

      if (images.length === 0) {
        await ctx.runMutation(internal.projects.updateProjectInternal, {
          projectId: args.projectId,
          updates: { photoAnalysisStatus: "complete", photoAnalysis: null },
        });
        return;
      }

      // Build prompt
      const prompt = photoAnalysisPrompt
        .replace("{{projectType}}", project.projectType)
        .replace("{{propertyState}}", project.propertyState)
        .replace("{{propertyType}}", project.propertyType)
        .replace("{{yearBuilt}}", String(project.propertyAge ?? "Unknown"));

      // Call Gemini vision
      const result = await callGeminiVision(apiKey, images, prompt);

      // Save result
      await ctx.runMutation(internal.projects.updateProjectInternal, {
        projectId: args.projectId,
        updates: {
          photoAnalysis: result,
          photoAnalysisStatus: "complete",
        },
      });
    } catch (err) {
      console.error("Photo analysis failed:", err);
      await ctx.runMutation(internal.projects.updateProjectInternal, {
        projectId: args.projectId,
        updates: { photoAnalysisStatus: "failed" },
      });
    }
  },
});

// Public wrapper — called from client
export const triggerAnalysePhotos = action({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.runAction(internal.ai.analysePhotos, {
      projectId: args.projectId,
    });
  },
});

// =============================================================================
// Scope Generation
// =============================================================================

export const generateScopes = action({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not set");

    // Get project
    const project = await ctx.runQuery(
      internal.projects.getProjectInternal,
      { projectId: args.projectId }
    );
    if (!project) throw new Error("Project not found");

    // Wait for photo analysis (up to 60s)
    let photoAnalysis = project.photoAnalysis;
    if (project.photoAnalysisStatus === "running") {
      for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        const updated = await ctx.runQuery(
          internal.projects.getProjectInternal,
          { projectId: args.projectId }
        );
        if (
          updated &&
          updated.photoAnalysisStatus !== "running"
        ) {
          photoAnalysis = updated.photoAnalysis;
          break;
        }
      }
    }

    // Set project status to generating
    await ctx.runMutation(internal.projects.updateProjectInternal, {
      projectId: args.projectId,
      updates: { status: "generating" },
    });

    // Determine required trades
    const answers: QuestionAnswers = (project.answers as QuestionAnswers) ?? {};
    const projectType = project.projectType as ProjectType;
    const { trades } = determineRequiredTrades(projectType, answers);
    const qualityTier = parseQualityTier(answers["quality_tier"]);

    // Initialize progress
    const failed: string[] = [];
    await ctx.runMutation(internal.projects.updateGenerationProgressInternal, {
      projectId: args.projectId,
      total: trades.length,
      completed: 0,
      current: TRADE_META[trades[0]].title,
      failed: [],
    });

    // Build context JSON
    const projectContext = JSON.stringify({
      projectType,
      mode: project.mode,
      propertyDetails: {
        suburb: project.propertySuburb,
        state: project.propertyState,
        type: project.propertyType,
        yearBuilt: project.propertyAge,
      },
      photoAnalysis: photoAnalysis ?? null,
      answers,
      qualityTier,
    });

    // Generate each trade scope sequentially
    let completed = 0;
    const scopeSummaries: {
      tradeType: string;
      title: string;
      itemCount: number;
    }[] = [];

    for (const trade of trades) {
      // Check if prompt exists
      if (BLOCKED_TRADES.has(trade)) {
        console.warn(
          `Skipping ${trade} — no prompt (research pending)`
        );
        completed++;
        await ctx.runMutation(
          internal.projects.updateGenerationProgressInternal,
          {
            projectId: args.projectId,
            total: trades.length,
            completed,
            current: completed < trades.length ? TRADE_META[trades[completed]]?.title : undefined,
            failed,
          }
        );
        continue;
      }

      const tradePrompt = tradePrompts[trade];
      if (!tradePrompt) {
        console.warn(`No prompt for trade: ${trade}`);
        completed++;
        continue;
      }

      // Update progress
      await ctx.runMutation(
        internal.projects.updateGenerationProgressInternal,
        {
          projectId: args.projectId,
          total: trades.length,
          completed,
          current: TRADE_META[trade].title,
          failed,
        }
      );

      // Build combined prompt
      const combinedPrompt =
        masterSystemPrompt +
        "\n\n" +
        tradePrompt.replace("{{projectContext}}", projectContext);

      // Try generation with one retry
      let scope: Record<string, unknown> | null = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const result = await callGeminiText(apiKey, combinedPrompt);
          scope = result as Record<string, unknown>;
          break;
        } catch (err) {
          console.error(
            `Trade ${trade} attempt ${attempt + 1} failed:`,
            err
          );
          if (attempt === 0) {
            await new Promise((r) => setTimeout(r, 2000));
          }
        }
      }

      if (!scope) {
        failed.push(trade);
        completed++;
        await ctx.runMutation(
          internal.projects.updateGenerationProgressInternal,
          {
            projectId: args.projectId,
            total: trades.length,
            completed,
            current: completed < trades.length ? TRADE_META[trades[completed]]?.title : undefined,
            failed,
          }
        );
        continue;
      }

      // Run validation
      const items = (scope.items as Array<Record<string, unknown>>) ?? [];
      const validation = validateScope(
        {
          tradeType: trade,
          title: (scope.title as string) ?? TRADE_META[trade].title,
          items: items as never[],
          exclusions: (scope.exclusions as string[]) ?? [],
          pcSums: scope.pcSums as unknown[] | undefined,
          complianceNotes: scope.complianceNotes as string | undefined,
          warnings: scope.warnings as string[] | undefined,
          notes: scope.notes as string | undefined,
        },
        projectType,
        {
          suburb: project.propertySuburb,
          state: project.propertyState,
          type: project.propertyType,
          yearBuilt: project.propertyAge,
        },
        answers
      );

      // Merge additions from validation
      if (validation.additions.length > 0) {
        items.push(...(validation.additions as unknown as Record<string, unknown>[]));
      }

      // Log validation issues
      for (const issue of validation.issues) {
        console.log(`[${trade}] ${issue.severity}: ${issue.message}`);
      }

      // Save scope
      await ctx.runMutation(internal.scopes.saveScopeInternal, {
        projectId: args.projectId,
        tradeType: trade,
        title: (scope.title as string) ?? TRADE_META[trade].title,
        items,
        exclusions: scope.exclusions ?? [],
        pcSums: scope.pcSums,
        complianceNotes: scope.complianceNotes as string | undefined,
        notes: scope.notes as string | undefined,
        warnings: scope.warnings,
        diyOption: scope.diyOption as string | undefined,
        sortOrder: TRADE_META[trade].sortOrder,
      });

      scopeSummaries.push({
        tradeType: trade,
        title: (scope.title as string) ?? TRADE_META[trade].title,
        itemCount: items.length,
      });

      completed++;
      await ctx.runMutation(
        internal.projects.updateGenerationProgressInternal,
        {
          projectId: args.projectId,
          total: trades.length,
          completed,
          current: completed < trades.length ? TRADE_META[trades[completed]]?.title : undefined,
          failed,
        }
      );
    }

    // Generate sequencing plan
    try {
      await generateSequencingPlan(
        ctx,
        apiKey,
        args.projectId,
        projectType,
        trades,
        scopeSummaries,
        projectContext
      );
    } catch (err) {
      console.error("Sequencing generation failed:", err);
    }

    // Generate coordination checklist
    try {
      await generateCoordinationChecklist(
        ctx,
        apiKey,
        args.projectId,
        scopeSummaries,
        projectContext
      );
    } catch (err) {
      console.error("Coordination generation failed:", err);
    }

    // Set project to generated
    await ctx.runMutation(internal.projects.updateProjectInternal, {
      projectId: args.projectId,
      updates: { status: "generated" },
    });
  },
});

// =============================================================================
// Sequencing Plan Generation (helper — called from generateScopes)
// =============================================================================

async function generateSequencingPlan(
  ctx: { runMutation: Function; runQuery: Function },
  apiKey: string,
  projectId: Id<"projects">,
  projectType: ProjectType,
  trades: TradeType[],
  scopeSummaries: { tradeType: string; title: string; itemCount: number }[],
  projectContext: string
) {
  const template = getSequencingTemplate(projectType);
  const filteredPhases = filterTemplatePhasesForTrades(template, trades);

  const prompt = sequencingPrompt
    .replace("{{projectContext}}", projectContext)
    .replace("{{templatePhases}}", JSON.stringify(filteredPhases, null, 2))
    .replace("{{scopeSummaries}}", JSON.stringify(scopeSummaries, null, 2));

  const result = (await callGeminiText(apiKey, prompt)) as Record<
    string,
    unknown
  >;

  await ctx.runMutation(internal.scopes.saveSequencingPlanInternal, {
    projectId,
    phases: result.phases ?? [],
    totalDurationEstimate:
      (result.totalDurationEstimate as string) ?? template.baseEstimate,
  });
}

// =============================================================================
// Coordination Checklist Generation (helper — called from generateScopes)
// =============================================================================

async function generateCoordinationChecklist(
  ctx: { runMutation: Function; runQuery: Function },
  apiKey: string,
  projectId: Id<"projects">,
  scopeSummaries: { tradeType: string; title: string; itemCount: number }[],
  projectContext: string
) {
  const prompt = coordinationPrompt
    .replace("{{projectContext}}", projectContext)
    .replace("{{scopeSummaries}}", JSON.stringify(scopeSummaries, null, 2))
    .replace("{{sequencingPlan}}", "See sequencing plan generated above.");

  const result = (await callGeminiText(apiKey, prompt)) as Record<
    string,
    unknown
  >;

  await ctx.runMutation(internal.scopes.saveCoordinationChecklistInternal, {
    projectId,
    items: result.items ?? [],
  });
}

// =============================================================================
// Retry Single Trade Scope
// =============================================================================

export const retryTradeScope = action({
  args: {
    projectId: v.id("projects"),
    tradeType: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not set");

    const project = await ctx.runQuery(
      internal.projects.getProjectInternal,
      { projectId: args.projectId }
    );
    if (!project) throw new Error("Project not found");

    const trade = args.tradeType as TradeType;
    const tradePrompt = tradePrompts[trade];
    if (!tradePrompt) throw new Error(`No prompt for trade: ${trade}`);

    // Delete existing failed scope
    await ctx.runMutation(internal.scopes.deleteScopeByTradeInternal, {
      projectId: args.projectId,
      tradeType: trade,
    });

    const answers: QuestionAnswers = (project.answers as QuestionAnswers) ?? {};
    const projectType = project.projectType as ProjectType;
    const qualityTier = parseQualityTier(answers["quality_tier"]);

    const projectContext = JSON.stringify({
      projectType,
      mode: project.mode,
      propertyDetails: {
        suburb: project.propertySuburb,
        state: project.propertyState,
        type: project.propertyType,
        yearBuilt: project.propertyAge,
      },
      photoAnalysis: project.photoAnalysis ?? null,
      answers,
      qualityTier,
    });

    const combinedPrompt =
      masterSystemPrompt +
      "\n\n" +
      tradePrompt.replace("{{projectContext}}", projectContext);

    // Try with one retry
    let scope: Record<string, unknown> | null = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await callGeminiText(apiKey, combinedPrompt);
        scope = result as Record<string, unknown>;
        break;
      } catch (err) {
        console.error(
          `Retry ${trade} attempt ${attempt + 1} failed:`,
          err
        );
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }

    if (!scope) {
      throw new Error(`Failed to generate ${trade} scope after retries`);
    }

    // Validate and save
    const items = (scope.items as Array<Record<string, unknown>>) ?? [];
    const validation = validateScope(
      {
        tradeType: trade,
        title: (scope.title as string) ?? TRADE_META[trade].title,
        items: items as never[],
        exclusions: (scope.exclusions as string[]) ?? [],
        pcSums: scope.pcSums as unknown[] | undefined,
        complianceNotes: scope.complianceNotes as string | undefined,
        warnings: scope.warnings as string[] | undefined,
        notes: scope.notes as string | undefined,
      },
      projectType,
      {
        suburb: project.propertySuburb,
        state: project.propertyState,
        type: project.propertyType,
        yearBuilt: project.propertyAge,
      },
      answers
    );

    if (validation.additions.length > 0) {
      items.push(...(validation.additions as unknown as Record<string, unknown>[]));
    }

    await ctx.runMutation(internal.scopes.saveScopeInternal, {
      projectId: args.projectId,
      tradeType: trade,
      title: (scope.title as string) ?? TRADE_META[trade].title,
      items,
      exclusions: scope.exclusions ?? [],
      pcSums: scope.pcSums,
      complianceNotes: scope.complianceNotes as string | undefined,
      notes: scope.notes as string | undefined,
      warnings: scope.warnings,
      diyOption: scope.diyOption as string | undefined,
      sortOrder: TRADE_META[trade].sortOrder,
    });

    // Update generation progress — remove trade from failed list
    const progress = project.generationProgress as {
      total: number;
      completed: number;
      current?: string;
      failed: string[];
    } | undefined;

    if (progress) {
      await ctx.runMutation(
        internal.projects.updateGenerationProgressInternal,
        {
          projectId: args.projectId,
          total: progress.total,
          completed: progress.completed,
          current: undefined,
          failed: progress.failed.filter((t: string) => t !== trade),
        }
      );
    }

    return { success: true };
  },
});
