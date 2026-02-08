// =============================================================================
// Stripe — Checkout Session creation
// =============================================================================

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import Stripe from "stripe";

export const createCheckoutSession = action({
  args: {
    projectId: v.id("projects"),
    tier: v.union(
      v.literal("starter"),
      v.literal("professional"),
      v.literal("premium")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify project ownership and status
    const project = await ctx.runQuery(internal.projects.getProjectInternal, {
      projectId: args.projectId,
    });
    if (!project) throw new Error("Project not found");
    if (project.userId !== userId) throw new Error("Not authorized");
    if (project.status === "paid") throw new Error("Project already paid");
    if (project.status !== "generated") {
      throw new Error("Scope must be generated before payment");
    }

    // Map tier to Stripe Price ID
    const priceMap: Record<string, string | undefined> = {
      starter: process.env.STRIPE_PRICE_STARTER,
      professional: process.env.STRIPE_PRICE_PROFESSIONAL,
      premium: process.env.STRIPE_PRICE_PREMIUM,
    };
    const priceId = priceMap[args.tier];
    if (!priceId) {
      throw new Error(`No Stripe price configured for tier: ${args.tier}`);
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const siteUrl = process.env.SITE_URL;
    if (!siteUrl) throw new Error("SITE_URL not configured");

    const stripe = new Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/scope/${args.projectId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/scope/${args.projectId}`,
      metadata: {
        projectId: args.projectId,
        tier: args.tier,
      },
    });

    return session.url;
  },
});
