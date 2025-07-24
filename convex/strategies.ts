import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 모든 매매전략 조회
export const getAllStrategies = query({
  handler: async (ctx) => {
    const strategies = await ctx.db.query("tradingStrategies").order("desc").collect();
    return strategies.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// 활성 매매전략 조회
export const getActiveStrategies = query({
  handler: async (ctx) => {
    const strategies = await ctx.db
      .query("tradingStrategies")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    return strategies.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// 매매전략 추가
export const addStrategy = mutation({
  args: {
    title: v.string(),
    type: v.string(),
    entryCondition: v.string(),
    exitCondition: v.string(),
    stopLoss: v.string(),
    riskManagement: v.string(),
    description: v.string(),
    tags: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const strategyId = await ctx.db.insert("tradingStrategies", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return strategyId;
  },
});

// 매매전략 수정
export const updateStrategy = mutation({
  args: {
    id: v.id("tradingStrategies"),
    title: v.string(),
    type: v.string(),
    entryCondition: v.string(),
    exitCondition: v.string(),
    stopLoss: v.string(),
    riskManagement: v.string(),
    description: v.string(),
    tags: v.optional(v.string()),
    isActive: v.boolean(),
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

// 매매전략 삭제
export const deleteStrategy = mutation({
  args: { id: v.id("tradingStrategies") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// 매매전략 활성화/비활성화
export const toggleStrategyActive = mutation({
  args: {
    id: v.id("tradingStrategies"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

// 전략 타입별 조회
export const getStrategiesByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    const strategies = await ctx.db
      .query("tradingStrategies")
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();
    return strategies.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});