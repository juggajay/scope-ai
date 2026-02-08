import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User profiles (extends Convex Auth user)
  profiles: defineTable({
    userId: v.string(),
    email: v.string(),
    fullName: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  // Renovation projects
  projects: defineTable({
    userId: v.string(),

    // Mode and type
    mode: v.union(v.literal("trades"), v.literal("builder")),
    projectType: v.string(),

    // Property details
    propertySuburb: v.optional(v.string()),
    propertyState: v.string(),
    propertyType: v.string(),
    propertyAge: v.optional(v.number()),

    // User inputs
    description: v.optional(v.string()),
    answers: v.optional(v.any()),

    // AI analysis result
    photoAnalysis: v.optional(v.any()),

    // Photo analysis status
    photoAnalysisStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("running"),
        v.literal("complete"),
        v.literal("failed")
      )
    ),

    // Status
    status: v.union(
      v.literal("draft"),
      v.literal("generating"),
      v.literal("generated"),
      v.literal("paid")
    ),

    // Generation progress
    generationProgress: v.optional(
      v.object({
        total: v.number(),
        completed: v.number(),
        current: v.optional(v.string()),
        failed: v.array(v.string()),
      })
    ),

    // Payment
    paymentTier: v.optional(
      v.union(
        v.literal("starter"),
        v.literal("professional"),
        v.literal("premium")
      )
    ),
    paymentAmountCents: v.optional(v.number()),
    stripeSessionId: v.optional(v.string()),
    stripePaymentId: v.optional(v.string()),
    paidAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_stripeSessionId", ["stripeSessionId"]),

  // Uploaded photos per project
  projectPhotos: defineTable({
    projectId: v.optional(v.id("projects")),
    sessionId: v.optional(v.string()),
    storageId: v.string(),
    originalFilename: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    analysisResult: v.optional(v.any()),
  })
    .index("by_projectId", ["projectId"])
    .index("by_sessionId", ["sessionId"]),

  // Generated trade scopes (one document per trade per project)
  scopes: defineTable({
    projectId: v.id("projects"),

    tradeType: v.string(),
    title: v.string(),

    // Scope content
    items: v.any(),
    exclusions: v.any(),
    pcSums: v.optional(v.any()),
    complianceNotes: v.optional(v.string()),
    notes: v.optional(v.string()),
    warnings: v.optional(v.any()),
    diyOption: v.optional(v.string()),

    sortOrder: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_projectId_tradeType", ["projectId", "tradeType"]),

  // Sequencing plan (one per project)
  sequencingPlans: defineTable({
    projectId: v.id("projects"),
    phases: v.any(),
    totalDurationEstimate: v.string(),
  }).index("by_projectId", ["projectId"]),

  // Coordination checklist (one per project)
  coordinationChecklists: defineTable({
    projectId: v.id("projects"),
    items: v.any(),
  }).index("by_projectId", ["projectId"]),

  // Generated PDF documents
  documents: defineTable({
    projectId: v.id("projects"),
    documentType: v.string(),
    storageId: v.string(),
    filename: v.string(),
  }).index("by_projectId", ["projectId"]),
});
