import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// 모든 거래 조회
export const getAllTrades = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const trades = await ctx.db
      .query("trades")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("asc")
      .collect();
    return trades;
  },
});

// 거래 추가
export const addTrade = mutation({
  args: {
    userId: v.string(),
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

// 거래 삭제 (데모 모드)
export const deleteTrade = mutation({
  args: { id: v.id("trades") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// 최근 거래 조회 (데모 모드)
export const getRecentTrades = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const trades = await ctx.db
      .query("trades")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
    return trades.reverse(); // 날짜 순으로 정렬
  },
});