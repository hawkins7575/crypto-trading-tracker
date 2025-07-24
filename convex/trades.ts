import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 모든 거래 조회
export const getAllTrades = query({
  handler: async (ctx) => {
    const trades = await ctx.db.query("trades").order("desc").collect();
    return trades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
});

// 거래 추가
export const addTrade = mutation({
  args: {
    date: v.string(),
    entry: v.number(),
    withdrawal: v.number(),
    balance: v.number(),
    profit: v.number(),
    profitRate: v.number(),
    memo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const tradeId = await ctx.db.insert("trades", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return tradeId;
  },
});

// 거래 수정
export const updateTrade = mutation({
  args: {
    id: v.id("trades"),
    date: v.string(),
    entry: v.number(),
    withdrawal: v.number(),
    balance: v.number(),
    profit: v.number(),
    profitRate: v.number(),
    memo: v.optional(v.string()),
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

// 거래 삭제
export const deleteTrade = mutation({
  args: { id: v.id("trades") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// 날짜 범위로 거래 조회
export const getTradesByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const trades = await ctx.db
      .query("trades")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), args.startDate),
          q.lte(q.field("date"), args.endDate)
        )
      )
      .collect();
    return trades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
});

// 최근 거래 조회
export const getRecentTrades = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const trades = await ctx.db
      .query("trades")
      .order("desc")
      .take(limit);
    return trades.reverse(); // 날짜 순으로 정렬
  },
});