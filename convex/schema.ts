import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  trades: defineTable({
    date: v.string(),
    entry: v.number(),
    withdrawal: v.number(),
    balance: v.number(),
    profit: v.number(),
    profitRate: v.number(),
    memo: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_date", ["date"]),

  tradingJournals: defineTable({
    date: v.string(),
    title: v.string(),
    content: v.string(),
    mood: v.string(),
    tags: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_date", ["date"]),

  tradingStrategies: defineTable({
    title: v.string(),
    type: v.string(), // 'scalping', 'day', 'swing'
    entryCondition: v.string(),
    exitCondition: v.string(),
    stopLoss: v.string(),
    riskManagement: v.string(),
    description: v.string(),
    tags: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_active", ["isActive"]),

  goals: defineTable({
    monthlyTarget: v.number(),
    weeklyTarget: v.number(),
    yearlyTarget: v.number(),
    targetWinRate: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),
});