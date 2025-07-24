import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// 현재 목표 조회
export const getCurrentGoals = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const goals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();
    return goals || {
      monthlyTarget: 1000000,
      weeklyTarget: 250000,
      yearlyTarget: 12000000,
      targetWinRate: 70,
    };
  },
});

// 목표 설정/업데이트
export const setGoals = mutation({
  args: {
    monthlyTarget: v.number(),
    weeklyTarget: v.number(),
    yearlyTarget: v.number(),
    targetWinRate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const now = Date.now();
    
    // 기존 목표가 있는지 확인
    const existingGoals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();
    
    if (existingGoals) {
      // 기존 목표 업데이트
      await ctx.db.patch(existingGoals._id, {
        ...args,
        updatedAt: now,
      });
      return existingGoals._id;
    } else {
      // 새 목표 생성
      const goalId = await ctx.db.insert("goals", {
        ...args,
        userId,
        createdAt: now,
        updatedAt: now,
      });
      return goalId;
    }
  },
});

// 목표 달성률 조회 (통계와 함께)
export const getGoalsWithProgress = query({
  args: {
    currentProfit: v.number(),
    currentWinRate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Client is not authenticated!");
    }
    
    const goals = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();
    
    if (!goals) {
      return {
        goals: {
          monthlyTarget: 1000000,
          weeklyTarget: 250000,
          yearlyTarget: 12000000,
          targetWinRate: 70,
        },
        progress: {
          monthlyProgress: (args.currentProfit / 1000000) * 100,
          winRateProgress: (args.currentWinRate / 70) * 100,
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