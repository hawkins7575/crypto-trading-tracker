import { useMemo } from 'react';
import { Trade } from '@/types';

export const useMemoizedCalculations = (trades: Trade[]) => {
  // 거래 필터링 메모이제이션
  const filteredTradesByProfit = useMemo(() => {
    return trades.filter(trade => trade.profit > 0);
  }, [trades]);

  const filteredTradesByLoss = useMemo(() => {
    return trades.filter(trade => trade.profit < 0);
  }, [trades]);

  const filteredTradesByWeek = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return trades.filter(trade => new Date(trade.date) >= weekAgo);
  }, [trades]);

  const filteredTradesByLarge = useMemo(() => {
    return trades.filter(trade => trade.entry >= 1000000);
  }, [trades]);

  // 통계 계산 메모이제이션
  const basicStats = useMemo(() => {
    if (trades.length === 0) {
      return {
        totalProfit: 0,
        totalTrades: 0,
        avgProfit: 0,
        winRate: 0
      };
    }

    const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
    const winningTrades = trades.filter(trade => trade.profit > 0).length;
    const winRate = (winningTrades / trades.length) * 100;
    const avgProfit = totalProfit / trades.length;

    return {
      totalProfit,
      totalTrades: trades.length,
      avgProfit,
      winRate
    };
  }, [trades]);

  // 월별 데이터 그룹화
  const monthlyData = useMemo(() => {
    const monthMap = new Map<string, Trade[]>();
    
    trades.forEach(trade => {
      const monthKey = trade.date.substring(0, 7); // YYYY-MM
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, []);
      }
      monthMap.get(monthKey)!.push(trade);
    });

    return Array.from(monthMap.entries()).map(([month, monthTrades]) => ({
      month,
      trades: monthTrades,
      totalProfit: monthTrades.reduce((sum, trade) => sum + trade.profit, 0),
      tradeCount: monthTrades.length
    }));
  }, [trades]);

  // 최근 거래 금액 추출
  const recentAmounts = useMemo(() => {
    const amounts = trades
      .slice(-10)
      .map(t => t.entry)
      .filter(amount => amount > 0);
    
    return Array.from(new Set(amounts)).sort((a, b) => b - a).slice(0, 5);
  }, [trades]);

  return {
    filteredTradesByProfit,
    filteredTradesByLoss,
    filteredTradesByWeek,
    filteredTradesByLarge,
    basicStats,
    monthlyData,
    recentAmounts
  };
};