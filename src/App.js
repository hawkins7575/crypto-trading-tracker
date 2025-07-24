import React, { useState, useEffect } from 'react';
import { Home, BarChart3, Activity, BookOpen } from 'lucide-react';

export default function App() {
  console.log("App component starting...");
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState(null);
  const [trades, setTrades] = useState([]);
  
  useEffect(() => {
    console.log("App useEffect running...");
    try {
      // 임시로 Convex 비활성화하고 기본 동작만 테스트
      setTrades([]);
      console.log("App initialized successfully");
    } catch (err) {
      console.error("Error in App useEffect:", err);
      setError(err.message);
    }
  }, []);
  
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-400">오류 발생</h1>
          <p className="text-slate-300">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* 헤더 */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">Crypto Trading Tracker</h1>
          </div>
          <div className="text-slate-300 text-sm">
            거래 데이터: {trades?.length || 0}개
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-slate-800 border-b border-slate-700 px-4">
        <div className="flex gap-1">
          {[
            { id: 'dashboard', name: '대시보드', icon: Home },
            { id: 'analytics', name: '분석', icon: BarChart3 },
            { id: 'trades', name: '거래내역', icon: Activity },
            { id: 'journal', name: '매매일지', icon: BookOpen },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 flex items-center gap-2 transition-colors ${
                activeTab === tab.id 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon size={16} />
              <span className="text-sm">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-6">
        {activeTab === 'dashboard' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">대시보드</h2>
            <p className="text-slate-400 mb-4">거래 데이터: {trades?.length || 0}개</p>
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block">
              ✅ 앱이 정상 작동 중입니다
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">분석</h2>
            <p className="text-slate-400">분석 기능 준비 중...</p>
          </div>
        )}
        
        {activeTab === 'trades' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">거래내역</h2>
            <p className="text-slate-400">거래내역 기능 준비 중...</p>
          </div>
        )}
        
        {activeTab === 'journal' && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">매매일지</h2>
            <p className="text-slate-400">매매일지 기능 준비 중...</p>
          </div>
        )}
      </div>
    </div>
  );
}