import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 모든 매매일지 조회
export const getAllJournals = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tradingJournals")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("asc")
      .collect();
  },
});

// 매매일지 추가
export const addJournal = mutation({
  args: {
    userId: v.string(),
    date: v.string(),
    title: v.string(),
    content: v.string(),
    mood: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("tradingJournals", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// 매매일지 수정
export const updateJournal = mutation({
  args: {
    id: v.id("tradingJournals"),
    date: v.string(),
    title: v.string(),
    content: v.string(),
    mood: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
    return id;
  },
});

// 매매일지 삭제
export const deleteJournal = mutation({
  args: { id: v.id("tradingJournals") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// 월별 매매일지 조회
export const getJournalsByMonth = query({
  args: {
    userId: v.string(),
    year: v.number(),
    month: v.number(),
  },
  handler: async (ctx, args) => {
    const startDate = `${args.year}-${String(args.month).padStart(2, '0')}-01`;
    const endDate = `${args.year}-${String(args.month).padStart(2, '0')}-31`;
    
    return await ctx.db
      .query("tradingJournals")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate)
        )
      )
      .order("asc")
      .collect();
  },
});

// 최근 매매일지 조회
export const getRecentJournals = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    return await ctx.db
      .query("tradingJournals")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});