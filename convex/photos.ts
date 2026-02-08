import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Generate a Convex storage upload URL
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save photo record after upload (accepts sessionId OR projectId)
export const savePhoto = mutation({
  args: {
    storageId: v.string(),
    originalFilename: v.string(),
    fileSize: v.number(),
    mimeType: v.string(),
    sessionId: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const photoId = await ctx.db.insert("projectPhotos", {
      storageId: args.storageId,
      originalFilename: args.originalFilename,
      fileSize: args.fileSize,
      mimeType: args.mimeType,
      sessionId: args.sessionId,
      projectId: args.projectId,
    });
    return photoId;
  },
});

// List photos by projectId
export const getProjectPhotos = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projectPhotos")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

// List photos by sessionId (pre-auth, before project exists)
export const getSessionPhotos = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projectPhotos")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

// Internal: get photos by projectId with storage URLs (for AI actions)
export const getPhotosByProjectInternal = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("projectPhotos")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();

    const withUrls = await Promise.all(
      photos.map(async (photo) => {
        const url = await ctx.storage.getUrl(photo.storageId as Id<"_storage">);
        return { ...photo, url };
      })
    );

    return withUrls;
  },
});

// Delete photo record + storage file
export const deletePhoto = mutation({
  args: { photoId: v.id("projectPhotos") },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photoId);
    if (!photo) return;

    // Delete the file from storage
    await ctx.storage.delete(photo.storageId as Id<"_storage">);

    // Delete the record
    await ctx.db.delete(args.photoId);
  },
});
