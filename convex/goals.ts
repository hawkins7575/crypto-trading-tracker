import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 현재 목표 조회
export const getCurrentGoals = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const goals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
    return goals;
  },
});

// 목표 설정/업데이트
export const setGoals = mutation({
  args: {
    userId: v.string(),
    monthlyTarget: v.number(),
    weeklyTarget: v.number(),
    yearlyTarget: v.number(),
    targetWinRate: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existingGoals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
    
    if (existingGoals) {
      await ctx.db.patch(existingGoals._id, {
        ...args,
        updatedAt: now,
      });
      return existingGoals._id;
    } else {
      return await ctx.db.insert("goals", {
        ...args,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// 목표 달성률 조회 (통계와 함께)
export const getGoalsWithProgress = query({
  args: {
    userId: v.string(),
    currentProfit: v.number(),
    currentWinRate: v.number(),
  },
  handler: async (ctx, args) => {
    const goals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
    
    if (!goals) {
      // 기본 목표 값 설정 (목표가 설정되지 않았을 경우)
      const defaultGoals = {
        monthlyTarget: 1000000,
        weeklyTarget: 250000,
        yearlyTarget: 12000000,
        targetWinRate: 70,
      };
      return {
        goals: defaultGoals,
        progress: {
          monthlyProgress: (args.currentProfit / defaultGoals.monthlyTarget) * 100,
          winRateProgress: (args.currentWinRate / defaultGoals.targetWinRate) * 100,
        },
      };
    }
    
    return {
      goals,
      progress: {
        monthlyProgress: (args.currentProfit / goals.monthlyTarget) * 100,
        weeklyProgress: (args.currentProfit / goals.weeklyTarget) * 100,
        yearlyProgress: (args.currentProfit / goals.yearlyTarget) * 100,
        winRateProgress: (args.currentWinRate / goals.targetWinRate) * 100,
      },
    };
  },
});