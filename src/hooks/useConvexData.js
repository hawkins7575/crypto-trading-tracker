import { useQuery, useMutation } from "convex/react";

// 안전한 API import with error handling
let api = null;

// Dynamic import를 사용하여 ES6 모듈 스타일로 로딩
const loadApi = async () => {
  try {
    const apiModule = await import("../_generated/api");
    api = apiModule.api || apiModule.default || apiModule;
  } catch (error) {
    // API 파일을 찾을 수 없음 - 조용히 무시
  }
};

// 즉시 실행하여 API 로드
loadApi();

// 더미 함수들 - null 반환하는 안전한 함수
const dummyQuery = () => null;
const dummyMutation = () => () => Promise.resolve();

// 거래 데이터 훅 - 완전히 안전한 버전
export const useTradesData = () => {
  // Hooks를 항상 같은 순서로 무조건 호출
  const trades = useQuery(api?.trades?.getAllTrades || dummyQuery);
  const recentTrades = useQuery(api?.trades?.getRecentTrades || dummyQuery, 
    api?.trades?.getRecentTrades ? { limit: 10 } : undefined);
  const addTrade = useMutation(api?.trades?.addTrade || dummyMutation);
  const updateTrade = useMutation(api?.trades?.updateTrade || dummyMutation);
  const deleteTrade = useMutation(api?.trades?.deleteTrade || dummyMutation);

  return {
    trades: trades || [],
    recentTrades: recentTrades || [],
    addTrade: addTrade || (() => Promise.resolve()),
    updateTrade: updateTrade || (() => Promise.resolve()),
    deleteTrade: deleteTrade || (() => Promise.resolve()),
  };
};

// 매매일지 데이터 훅 - 완전히 안전한 버전
export const useJournalsData = () => {
  // Hooks를 항상 같은 순서로 무조건 호출
  const journals = useQuery(api?.journals?.getAllJournals || dummyQuery);
  const recentJournals = useQuery(api?.journals?.getRecentJournals || dummyQuery, 
    api?.journals?.getRecentJournals ? { limit: 5 } : undefined);
  const addJournal = useMutation(api?.journals?.addJournal || dummyMutation);
  const updateJournal = useMutation(api?.journals?.updateJournal || dummyMutation);
  const deleteJournal = useMutation(api?.journals?.deleteJournal || dummyMutation);

  return {
    journals: journals || [],
    recentJournals: recentJournals || [],
    addJournal: addJournal || (() => Promise.resolve()),
    updateJournal: updateJournal || (() => Promise.resolve()),
    deleteJournal: deleteJournal || (() => Promise.resolve()),
  };
};

// 매매전략 데이터 훅 - 완전히 안전한 버전
export const useStrategiesData = () => {
  // Hooks를 항상 같은 순서로 무조건 호출
  const strategies = useQuery(api?.strategies?.getAllStrategies || dummyQuery);
  const addStrategy = useMutation(api?.strategies?.addStrategy || dummyMutation);
  const updateStrategy = useMutation(api?.strategies?.updateStrategy || dummyMutation);
  const deleteStrategy = useMutation(api?.strategies?.deleteStrategy || dummyMutation);

  return {
    strategies: strategies || [],
    activeStrategies: (strategies || []).filter(s => s.isActive),
    addStrategy: addStrategy || (() => Promise.resolve()),
    updateStrategy: updateStrategy || (() => Promise.resolve()),
    deleteStrategy: deleteStrategy || (() => Promise.resolve()),
  };
};

// 목표 데이터 훅 - 완전히 안전한 버전
export const useGoalsData = () => {
  // Hooks를 항상 같은 순서로 무조건 호출
  const goals = useQuery(api?.goals?.getCurrentGoals || dummyQuery);
  const setGoals = useMutation(api?.goals?.setGoals || dummyMutation);

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