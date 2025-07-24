import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// 모든 매매전략 조회
export const getAllStrategies = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const strategies = await ctx.db
      .query("tradingStrategies")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return strategies.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// 활성 매매전략 조회
export const getActiveStrategies = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const strategies = await ctx.db
      .query("tradingStrategies")
      .withIndex("by_user", (q) => q.eq("userId", userId))
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
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const now = Date.now();
    const strategyId = await ctx.db.insert("tradingStrategies", {
      ...args,
      userId,
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
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const { id, ...updateData } = args;
    
    // 소유권 확인
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
  args: { id: v.id("tradingStrategies") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    // 소유권 확인
    const strategy = await ctx.db.get(args.id);
    if (!strategy || strategy.userId !== userId) {
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
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    // 소유권 확인
    const strategy = await ctx.db.get(args.id);
    if (!strategy || strategy.userId !== userId) {
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
  args: { type: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const strategies = await ctx.db
      .query("tradingStrategies")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();
    return strategies.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});