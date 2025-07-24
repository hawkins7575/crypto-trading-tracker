import React, { useState, useEffect } from 'react';
import { useTradesData } from './hooks/useConvexData';

export default function App() {
  console.log("App component is rendering...");
  
  const [error, setError] = useState(null);
  
  // Convex hooks는 항상 호출되어야 함
  const { trades } = useTradesData();
  
  useEffect(() => {
    console.log("Trades data loaded:", trades);
  }, [trades]);
  
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error Detected</h1>
          <p className="text-xl text-red-300 mb-4">오류가 발생했습니다</p>
          <div className="bg-red-600 text-white px-6 py-3 rounded-lg inline-block">
            ❌ {error}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Convex Hook Test</h1>
        <p className="text-xl text-gray-300 mb-4">Convex hooks 테스트 중...</p>
        <div className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block mb-4">
          거래 데이터: {trades?.length || 0}개
        </div>
        <div className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block">
          ✅ Convex hooks 정상 작동
        </div>
      </div>
    </div>
  );
}