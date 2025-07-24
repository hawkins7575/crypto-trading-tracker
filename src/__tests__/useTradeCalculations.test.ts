import { renderHook } from '@testing-library/react';
import useTradeCalculations from '../hooks/useTradeCalculations';
import { Trade } from '../types';

describe('useTradeCalculations', () => {
  const mockTrades: Trade[] = [
    {
      id: 1,
      date: '2024-01-01',
      entry: 1000000,
      withdrawal: 0,
      balance: 1100000,
      profit: 100000,
      profitRate: 10,
      memo: 'First trade'
    },
    {
      id: 2,
      date: '2024-01-02',
      entry: 0,
      withdrawal: 50000,
      balance: 1080000,
      profit: 30000,
      profitRate: 2.73,
      memo: 'Second trade'
    }
  ];

  describe('calculateProfitAndRate', () => {
    it('should calculate profit and rate correctly', () => {
      const { result } = renderHook(() => useTradeCalculations([]));
      
      const calculation = result.current.calculateProfitAndRate(1000000, 0, 1100000, 0);
      
      expect(calculation.profit).toBe(100000);
      expect(calculation.profitRate).toBe(10);
      expect(calculation.error).toBeNull();
    });

    it('should handle withdrawal correctly', () => {
      const { result } = renderHook(() => useTradeCalculations([]));
      
      const calculation = result.current.calculateProfitAndRate(0, 50000, 1050000, 1100000);
      
      expect(calculation.profit).toBe(0);
      expect(calculation.profitRate).toBe(0);
      expect(calculation.error).toBeNull();
    });

    it('should return error for negative balance', () => {
      const { result } = renderHook(() => useTradeCalculations([]));
      
      const calculation = result.current.calculateProfitAndRate(1000000, 0, -100000, 0);
      
      expect(calculation.error).toBe('잔고는 0 이상이어야 합니다');
    });
  });

  describe('getStats', () => {
    it('should return correct stats for trades', () => {
      const { result } = renderHook(() => useTradeCalculations(mockTrades));
      
      const stats = result.current.getStats;
      
      expect(stats.totalProfit).toBe(130000);
      expect(stats.totalInvested).toBe(1000000);
      expect(stats.totalWithdrawal).toBe(50000);
      expect(stats.currentBalance).toBe(1080000);
      expect(stats.totalTrades).toBe(2);
      expect(stats.winRate).toBe(100);
    });

    it('should return default stats for empty trades', () => {
      const { result } = renderHook(() => useTradeCalculations([]));
      
      const stats = result.current.getStats;
      
      expect(stats.totalProfit).toBe(0);
      expect(stats.totalInvested).toBe(0);
      expect(stats.totalTrades).toBe(0);
      expect(stats.winRate).toBe(0);
    });
  });

  describe('getRecentAmounts', () => {
    it('should return recent entry amounts', () => {
      const { result } = renderHook(() => useTradeCalculations(mockTrades));
      
      const recentAmounts = result.current.getRecentAmounts;
      
      expect(recentAmounts).toEqual([1000000]);
    });

    it('should return empty array for no entry amounts', () => {
      const noEntryTrades: Trade[] = [
        { ...mockTrades[0], entry: 0 },
        { ...mockTrades[1], entry: 0 }
      ];
      
      const { result } = renderHook(() => useTradeCalculations(noEntryTrades));
      
      const recentAmounts = result.current.getRecentAmounts;
      
      expect(recentAmounts).toEqual([]);
    });
  });

  describe('calculateCumulativeData', () => {
    it('should calculate cumulative data correctly', () => {
      const { result } = renderHook(() => useTradeCalculations(mockTrades));
      
      const cumulativeData = result.current.calculateCumulativeData();
      
      expect(cumulativeData).toHaveLength(2);
      expect(cumulativeData[0]).toMatchObject({
        cumulativeProfit: 100000,
        tradeNumber: 1
      });
      expect(cumulativeData[1]).toMatchObject({
        cumulativeProfit: 130000,
        tradeNumber: 2
      });
    });

    it('should return empty array for no trades', () => {
      const { result } = renderHook(() => useTradeCalculations([]));
      
      const cumulativeData = result.current.calculateCumulativeData();
      
      expect(cumulativeData).toEqual([]);
    });
  });
});