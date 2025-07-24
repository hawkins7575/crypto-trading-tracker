import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 임시 사용자 ID (인증 없이 데모용)
const DEMO_USER_ID = "demo-user";

// 모든 매매일지 조회 (데모 모드)
export const getAllJournals = query({
  handler: async (ctx) => {
    const journals = await ctx.db
      .query("tradingJournals")
      .order("desc")
      .collect();
    return journals.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
});

// 매매일지 추가 (데모 모드)
export const addJournal = mutation({
  args: {
    date: v.string(),
    title: v.string(),
    content: v.string(),
    mood: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const journalId = await ctx.db.insert("tradingJournals", {
      ...args,
      userId: DEMO_USER_ID,
      createdAt: now,
      updatedAt: now,
    });
    return journalId;
  },
});

// 매매일지 수정 (데모 모드)
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

// 매매일지 삭제 (데모 모드)
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

// 최근 매매일지 조회 (데모 모드)
export const getRecentJournals = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 5;
    const journals = await ctx.db
      .query("tradingJournals")
      .order("desc")
      .take(limit);
    return journals.reverse();
  },
});