import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 임시 사용자 ID (인증 없이 데모용)
const DEMO_USER_ID = "demo-user";

// 모든 거래 조회 (데모 모드)
export const getAllTrades = query({
  handler: async (ctx) => {
    const trades = await ctx.db
      .query("trades")
      .collect();
    return trades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
});

// 거래 추가 (데모 모드)
export const addTrade = mutation({
  args: {
    symbol: v.string(),
    type: v.string(),
    quantity: v.number(),
    price: v.number(),
    date: v.string(),
    memo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const tradeId = await ctx.db.insert("trades", {
      ...args,
      userId: DEMO_USER_ID,
      createdAt: now,
      updatedAt: now,
    });
    return tradeId;
  },
});

// 거래 수정 (데모 모드)
export const updateTrade = mutation({
  args: {
    id: v.id("trades"),
    symbol: v.string(),
    type: v.string(),
    quantity: v.number(),
    price: v.number(),
    date: v.string(),
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