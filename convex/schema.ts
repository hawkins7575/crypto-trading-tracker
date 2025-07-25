import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  trades: defineTable({
    userId: v.optional(v.string()),
    date: v.string(),
    entry: v.number(),
    withdrawal: v.number(),
    balance: v.number(),
    profit: v.number(),
    profitRate: v.number(),
    memo: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_date", ["date"])
   .index("by_user", ["userId"]),

  tradingJournals: defineTable({
    userId: v.optional(v.string()),
    date: v.string(),
    title: v.string(),
    content: v.string(),
    mood: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_date", ["date"])
   .index("by_user", ["userId"]),

  tradingStrategies: defineTable({
    userId: v.optional(v.string()),
    title: v.string(),
    type: v.union(v.literal('scalping'), v.literal('day'), v.literal('swing')),
    entryCondition: v.string(),
    exitCondition: v.string(),
    stopLoss: v.string(),
    riskManagement: v.string(),
    description: v.string(),
    tags: v.optional(v.array(v.string())),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_active", ["isActive"])
   .index("by_user", ["userId"]),

  goals: defineTable({
    userId: v.optional(v.string()),
    monthlyTarget: v.number(),
    weeklyTarget: v.number(),
    yearlyTarget: v.number(),
    targetWinRate: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
});