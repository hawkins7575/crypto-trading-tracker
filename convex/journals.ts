import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// 모든 매매일지 조회
export const getAllJournals = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const journals = await ctx.db
      .query("tradingJournals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return journals.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
});

// 매매일지 추가
export const addJournal = mutation({
  args: {
    date: v.string(),
    title: v.string(),
    content: v.string(),
    mood: v.string(),
    tags: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const now = Date.now();
    const journalId = await ctx.db.insert("tradingJournals", {
      ...args,
      userId,
      createdAt: now,
      updatedAt: now,
    });
    return journalId;
  },
});

// 매매일지 수정
export const updateJournal = mutation({
  args: {
    id: v.id("tradingJournals"),
    date: v.string(),
    title: v.string(),
    content: v.string(),
    mood: v.string(),
    tags: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const { id, ...updateData } = args;
    
    // 소유권 확인
    const journal = await ctx.db.get(id);
    if (!journal || journal.userId !== userId) {
      throw new Error("Unauthorized");
    }
    
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
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    // 소유권 확인
    const journal = await ctx.db.get(args.id);
    if (!journal || journal.userId !== userId) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// 월별 매매일지 조회
export const getJournalsByMonth = query({
  args: {
    year: v.number(),
    month: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const startDate = `${args.year}-${String(args.month).padStart(2, '0')}-01`;
    const endDate = `${args.year}-${String(args.month).padStart(2, '0')}-31`;
    
    const journals = await ctx.db
      .query("tradingJournals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), startDate),
          q.lte(q.field("date"), endDate)
        )
      )
      .collect();
    return journals.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
});

// 최근 매매일지 조회
export const getRecentJournals = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const limit = args.limit || 5;
    const journals = await ctx.db
      .query("tradingJournals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
    return journals.reverse();
  },
});