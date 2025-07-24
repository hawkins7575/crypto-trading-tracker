import { useCallback, useMemo } from 'react';
import { Trade, TradeStats } from '@/types';

const useTradeCalculations = (trades: Trade[]) => {
  const calculateCumulativeData = useCallback(() => {
    if (trades.length === 0) return [];
    
    let cumulativeProfit = 0;
    let totalInvested = 0;
    
    return trades.map((trade, index) => {
      cumulativeProfit += trade.profit || 0;
      totalInvested += trade.entry || 0;
      
      const cumulativeRate = totalInvested > 0 ? (cumulativeProfit / totalInvested) * 100 : 0;
      
      return {
        ...trade,
        cumulativeProfit,
        cumulativeRate: parseFloat(cumulativeRate.toFixed(2)),
        tradeNumber: index + 1
      };
    });
  }, [trades]);

  const calculateProfitAndRate = useCallback((entry: number, withdrawal: number, balance: number, prevBalance: number = 0) => {
    const entryAmount = entry || 0;
    const withdrawalAmount = withdrawal || 0;
    const balanceAmount = balance || 0;
    
    if (balanceAmount < 0) {
      return { profit: 0, profitRate: 0, error: '잔고는 0 이상이어야 합니다' };
    }
    
    const netFlow = entryAmount - withdrawalAmount;
    const expectedBalance = prevBalance + netFlow;
    const profit = balanceAmount - expectedBalance;
    
    let profitRate = 0;
    const base = prevBalance + entryAmount;
    if (base > 0) {
      profitRate = (profit / base) * 100;
    }
    
    return { 
      profit: parseFloat(profit.toFixed(2)), 
      profitRate: parseFloat(profitRate.toFixed(2)),
      error: null 
    };
  }, []);

  const getStats = useMemo((): TradeStats => {
    if (trades.length === 0) {
      return {
        totalProfit: 0,
        totalInvested: 0,
        totalWithdrawal: 0,
        currentBalance: 0,
        totalProfitRate: 0,
        winRate: 0,
        totalTrades: 0,
        avgProfit: 0,
        bestTrade: 0,
        worstTrade: 0,
        monthlyTarget: 1000000,
        weeklyTarget: 250000
      };
    }

    const totalProfit = trades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const totalInvested = trades.reduce((sum, trade) => sum + (trade.entry || 0), 0);
    const totalWithdrawal = trades.reduce((sum, trade) => sum + (trade.withdrawal || 0), 0);
    const currentBalance = trades.length > 0 ? trades[trades.length - 1].balance : 0;
    const netInvestment = totalInvested - totalWithdrawal;
    const totalProfitRate = netInvestment > 0 ? (totalProfit / netInvestment) * 100 : 0;
    const winningTrades = trades.filter(trade => (trade.profit || 0) > 0).length;
    const winRate = (winningTrades / trades.length) * 100;
    const avgProfit = totalProfit / trades.length;
    const profits = trades.map(t => t.profit || 0);
    const bestTrade = profits.length > 0 ? Math.max(...profits) : 0;
    const worstTrade = profits.length > 0 ? Math.min(...profits) : 0;

    return {
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      totalInvested: parseFloat(totalInvested.toFixed(2)),
      totalWithdrawal: parseFloat(totalWithdrawal.toFixed(2)),
      currentBalance: parseFloat(currentBalance.toFixed(2)),
      totalProfitRate: parseFloat(totalProfitRate.toFixed(2)),
      winRate: parseFloat(winRate.toFixed(1)),
      totalTrades: trades.length,
      avgProfit: parseFloat(avgProfit.toFixed(2)),
      bestTrade: parseFloat(bestTrade.toFixed(2)),
      worstTrade: parseFloat(worstTrade.toFixed(2)),
      monthlyTarget: 1000000,
      weeklyTarget: 250000
    };
  }, [trades]);

  const getRecentAmounts = useMemo((): number[] => {
    const amounts = trades.slice(-10).map(t => t.entry || 0).filter(a => a > 0);
    return Array.from(new Set(amounts)).sort((a, b) => b - a).slice(0, 5);
  }, [trades]);

  return { calculateCumulativeData, calculateProfitAndRate, getStats, getRecentAmounts };
};

export default useTradeCalculations;