import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 모든 매매전략 조회
export const getAllStrategies = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const strategies = await ctx.db
      .query("tradingStrategies")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    return strategies.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// 활성 매매전략 조회
export const getActiveStrategies = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const strategies = await ctx.db
      .query("tradingStrategies")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
    return strategies.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// 매매전략 추가
export const addStrategy = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    type: v.union(v.literal('scalping'), v.literal('day'), v.literal('swing')),
    entryCondition: v.string(),
    exitCondition: v.string(),
    stopLoss: v.string(),
    riskManagement: v.string(),
    description: v.string(),
    tags: v.optional(v.array(v.string())),
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
    userId: v.string(),
    title: v.string(),
    type: v.union(v.literal('scalping'), v.literal('day'), v.literal('swing')),
    entryCondition: v.string(),
    exitCondition: v.string(),
    stopLoss: v.string(),
    riskManagement: v.string(),
    description: v.string(),
    tags: v.optional(v.array(v.string())),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, userId, ...updateData } = args;
    
    // 소유권 확인 (userId를 인자로 받으므로, 해당 userId와 일치하는지 확인)
    const strategy = await ctx.db.get(id);
    if (!strategy || strategy.userId !== userId) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
    return id;
  },
});

// 매매전략 삭제
export const deleteStrategy = mutation({
  args: { id: v.id("tradingStrategies"), userId: v.string() },
  handler: async (ctx, args) => {
    // 소유권 확인
    const strategy = await ctx.db.get(args.id);
    if (!strategy || strategy.userId !== args.userId) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// 매매전략 활성화/비활성화
export const toggleStrategyActive = mutation({
  args: {
    id: v.id("tradingStrategies"),
    userId: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // 소유권 확인
    const strategy = await ctx.db.get(args.id);
    if (!strategy || strategy.userId !== args.userId) {
      throw new Error("Unauthorized");
    }
    
    await ctx.db.patch(args.id, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });
    return args.id;
  },
});

// 전략 타입별 조회
export const getStrategiesByType = query({
  args: { userId: v.string(), type: v.string() },
  handler: async (ctx, args) => {
    const strategies = await ctx.db
      .query("tradingStrategies")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();
    return strategies.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});