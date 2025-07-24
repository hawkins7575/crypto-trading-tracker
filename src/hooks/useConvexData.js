import { useQuery, useMutation } from "convex/react";

// Convex API가 아직 생성되지 않은 경우를 위한 더미 함수들
const dummyApi = {
  trades: {
    getAllTrades: null,
    addTrade: null,
    updateTrade: null,
    deleteTrade: null,
    getRecentTrades: null,
  },
  journals: {
    getAllJournals: null,
    addJournal: null,
    updateJournal: null,
    deleteJournal: null,
    getRecentJournals: null,
  },
  strategies: {
    getAllStrategies: null,
    getActiveStrategies: null,
    addStrategy: null,
    updateStrategy: null,
    deleteStrategy: null,
  },
  goals: {
    getCurrentGoals: null,
    setGoals: null,
  },
};

// Convex API 동적 로딩
let api;
try {
  // 배포 후 생성되는 API 파일 사용
  api = require("../_generated/api").api;
} catch (error) {
  console.warn("Convex API not available yet. Please run 'npx convex dev' first.");
  api = dummyApi;
}

// 거래 데이터 훅
export const useTradesData = () => {
  const trades = useQuery(api.trades?.getAllTrades) || [];
  const addTrade = useMutation(api.trades?.addTrade);
  const updateTrade = useMutation(api.trades?.updateTrade);
  const deleteTrade = useMutation(api.trades?.deleteTrade);
  const getRecentTrades = useQuery(api.trades?.getRecentTrades, api.trades?.getRecentTrades ? { limit: 10 } : undefined);

  return {
    trades,
    recentTrades: getRecentTrades || [],
    addTrade: addTrade || (() => Promise.resolve()),
    updateTrade: updateTrade || (() => Promise.resolve()),
    deleteTrade: deleteTrade || (() => Promise.resolve()),
  };
};

// 매매일지 데이터 훅
export const useJournalsData = () => {
  const journals = useQuery(api.journals?.getAllJournals) || [];
  const addJournal = useMutation(api.journals?.addJournal);
  const updateJournal = useMutation(api.journals?.updateJournal);
  const deleteJournal = useMutation(api.journals?.deleteJournal);
  const getRecentJournals = useQuery(api.journals?.getRecentJournals, api.journals?.getRecentJournals ? { limit: 3 } : undefined);

  return {
    journals,
    recentJournals: getRecentJournals || [],
    addJournal: addJournal || (() => Promise.resolve()),
    updateJournal: updateJournal || (() => Promise.resolve()),
    deleteJournal: deleteJournal || (() => Promise.resolve()),
  };
};

// 매매전략 데이터 훅
export const useStrategiesData = () => {
  const strategies = useQuery(api.strategies?.getAllStrategies) || [];
  const activeStrategies = useQuery(api.strategies?.getActiveStrategies) || [];
  const addStrategy = useMutation(api.strategies?.addStrategy);
  const updateStrategy = useMutation(api.strategies?.updateStrategy);
  const deleteStrategy = useMutation(api.strategies?.deleteStrategy);
  const toggleStrategyActive = useMutation(api.strategies?.toggleStrategyActive);

  return {
    strategies,
    activeStrategies,
    addStrategy: addStrategy || (() => Promise.resolve()),
    updateStrategy: updateStrategy || (() => Promise.resolve()),
    deleteStrategy: deleteStrategy || (() => Promise.resolve()),
    toggleStrategyActive: toggleStrategyActive || (() => Promise.resolve()),
  };
};

// 목표 데이터 훅
export const useGoalsData = () => {
  const goals = useQuery(api.goals?.getCurrentGoals);
  const setGoals = useMutation(api.goals?.setGoals);

  return {
    goals: goals || {
      monthlyTarget: 1000000,
      weeklyTarget: 250000,
      yearlyTarget: 12000000,
      targetWinRate: 70,
    },
    setGoals: setGoals || (() => Promise.resolve()),
  };
};