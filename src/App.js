import React, { useState } from 'react';
import { Home, BarChart3, Activity, BookOpen } from 'lucide-react';

export default function App() {
  console.log("App component starting...");
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 더미 데이터 사용
  const trades = [];
  const recentTrades = [];
  const journals = [];
  const goals = {
    monthlyTarget: 1000000,
    weeklyTarget: 250000,
    yearlyTarget: 12000000,
    targetWinRate: 70,
  };
  
  console.log("Using dummy data - no authentication required");
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* 헤더 */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">Crypto Trading Tracker</h1>
          </div>
          <div className="text-slate-300 text-sm">
            거래 데이터: {trades?.length || 0}개 (데모 모드)
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
          <div>
            <h2 className="text-2xl font-bold mb-6">대시보드</h2>
            
            {/* 통계 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">총 거래</h3>
                <p className="text-3xl font-bold text-white">{trades?.length || 0}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">매매일지</h3>
                <p className="text-3xl font-bold text-white">{journals?.length || 0}</p>
              </div>
              <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-300 mb-2">월간 목표</h3>
                <p className="text-3xl font-bold text-green-400">₩{(goals?.monthlyTarget || 0).toLocaleString()}</p>
              </div>
            </div>
            
            {/* 최근 거래 */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-6">
              <h3 className="text-lg font-semibold mb-4">최근 거래</h3>
              {recentTrades?.length > 0 ? (
                <div className="space-y-3">
                  {recentTrades.slice(0, 5).map((trade, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0">
                      <div>
                        <span className="text-white font-medium">{trade.symbol || 'N/A'}</span>
                        <span className="text-slate-400 ml-2">{trade.type || 'N/A'}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white">{trade.quantity || 0} 개</div>
                        <div className="text-slate-400 text-sm">₩{(trade.price || 0).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">아직 거래 데이터가 없습니다.</p>
              )}
            </div>
            
            <div className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block">
              🎯 데모 모드 - 앱 UI 테스트 버전
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
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">거래내역</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                새 거래 추가
              </button>
            </div>
            
            {trades?.length > 0 ? (
              <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">심볼</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">타입</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">수량</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">가격</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">총액</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">날짜</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {trades.map((trade, index) => (
                        <tr key={index} className="hover:bg-slate-700/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {trade.symbol || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              trade.type === 'buy' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                            }`}>
                              {trade.type || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {trade.quantity || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            ₩{(trade.price || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            ₩{((trade.quantity || 0) * (trade.price || 0)).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {trade.date ? new Date(trade.date).toLocaleDateString('ko-KR') : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 p-12 rounded-lg border border-slate-700 text-center">
                <Activity className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">거래 데이터가 없습니다</h3>
                <p className="text-slate-400 mb-6">첫 번째 거래를 추가해보세요.</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                  거래 추가하기
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'journal' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">매매일지</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                새 일지 작성
              </button>
            </div>
            
            {journals?.length > 0 ? (
              <div className="space-y-6">
                {journals.map((journal, index) => (
                  <div key={index} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {journal.title || '제목 없음'}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {journal.date ? new Date(journal.date).toLocaleDateString('ko-KR') : '날짜 없음'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-slate-400 hover:text-white text-sm">편집</button>
                        <button className="text-slate-400 hover:text-red-400 text-sm">삭제</button>
                      </div>
                    </div>
                    
                    {journal.trades && journal.trades.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">관련 거래</h4>
                        <div className="flex flex-wrap gap-2">
                          {journal.trades.map((trade, tradeIndex) => (
                            <span key={tradeIndex} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                              {trade}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-slate-300 leading-relaxed">
                      {journal.content || '내용이 없습니다.'}
                    </div>
                    
                    {journal.tags && journal.tags.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <div className="flex flex-wrap gap-2">
                          {journal.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800 p-12 rounded-lg border border-slate-700 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">매매일지가 없습니다</h3>
                <p className="text-slate-400 mb-6">첫 번째 매매일지를 작성해보세요.</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                  일지 작성하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}