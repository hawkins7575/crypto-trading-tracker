import React from 'react';
import { useQuery } from "convex/react";
import { CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';

const ConvexStatus = () => {
  // API 파일 로드 시도
  let api = null;
  try {
    api = require("../_generated/api").api;
  } catch (error) {
    // API 파일이 없는 경우
  }

  // 항상 Hook을 호출 (조건부 호출 금지)
  const testQuery = useQuery(api?.trades?.getAllTrades || null);
  
  // 연결 상태 확인
  const isConnected = api && testQuery !== undefined;
  const isLoading = api && testQuery === undefined;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
        <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
        <span className="text-yellow-300 text-sm font-medium">Convex 연결 중...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-lg">
        <div className="relative">
          <CheckCircle size={16} className="text-emerald-300" />
          <Wifi size={12} className="absolute -top-1 -right-1 text-emerald-400" />
        </div>
        <span className="text-emerald-200 text-sm font-medium">Convex 연결됨</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-lg">
      <div className="relative">
        <AlertCircle size={16} className="text-red-300" />
        <WifiOff size={12} className="absolute -top-1 -right-1 text-red-400" />
      </div>
      <span className="text-red-200 text-sm font-medium">Convex 연결 안됨</span>
    </div>
  );
};

export default ConvexStatus;