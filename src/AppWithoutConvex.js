import React, { useState } from 'react';
import { Home, BarChart3, Activity, BookOpen, PieChart, Settings, Bell, TrendingUp, Wallet, Target } from 'lucide-react';

// 더미 데이터
const dummyTrades = [
  { symbol: 'BTC', type: 'buy', quantity: 0.5, price: 67000000, date: '2024-01-15' },
  { symbol: 'ETH', type: 'sell', quantity: 2, price: 4500000, date: '2024-01-14' },
  { symbol: 'XRP', type: 'buy', quantity: 1000, price: 2345, date: '2024-01-13' }
];

const dummyJournals = [
  { title: '첫 번째 매매일지', content: '오늘의 거래 분석...', date: '2024-01-15', tags: ['분석', '수익'] }
];

export default function AppWithoutConvex() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTradeForm, setShowTradeForm] = useState(false);
  
  // 더미 데이터 사용
  const trades = dummyTrades;
  const journals = dummyJournals;
  const goals = {
    monthlyTarget: 1000000,
    yearlyTarget: 12000000
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* 헤더 */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Crypto Trading Tracker</h1>
              <p className="text-slate-400 text-sm">Professional Trading Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-slate-300 text-sm bg-slate-700 px-3 py-1 rounded-full">
              <Wallet size={14} className="inline mr-1" />
              거래 데이터: {trades?.length || 0}개 (더미 데이터)
            </div>
            <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-slate-800 border-b border-slate-700 px-4">
        <div className="flex gap-1">
          {[
            { id: 'dashboard', name: '대시보드', icon: Home },
            { id: 'portfolio', name: '포트폴리오', icon: PieChart },
            { id: 'analytics', name: '분석', icon: BarChart3 },
            { id: 'trades', name: '거래내역', icon: Activity },
            { id: 'journal', name: '매매일지', icon: BookOpen },
            { id: 'goals', name: '목표관리', icon: Target },
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-xl border border-blue-700 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Activity className="text-white" size={20} />
                  </div>
                  <span className="text-xs text-blue-300 bg-blue-800 px-2 py-1 rounded-full">+23%</span>
                </div>
                <h3 className="text-sm font-medium text-blue-200 mb-1">총 거래</h3>
                <p className="text-2xl font-bold text-white">{trades?.length || 0}</p>
                <p className="text-xs text-blue-300 mt-1">지난 달 대비</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-xl border border-green-700 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <TrendingUp className="text-white" size={20} />
                  </div>
                  <span className="text-xs text-green-300 bg-green-800 px-2 py-1 rounded-full">+15%</span>
                </div>
                <h3 className="text-sm font-medium text-green-200 mb-1">총 수익</h3>
                <p className="text-2xl font-bold text-white">
                  ₩{trades?.reduce((sum, trade) => {
                    return trade.type === 'sell' 
                      ? sum + (trade.quantity * trade.price)
                      : sum - (trade.quantity * trade.price);
                  }, 0).toLocaleString() || '0'}
                </p>
                <p className="text-xs text-green-300 mt-1">실현 손익</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-6 rounded-xl border border-purple-700 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <span className="text-xs text-purple-300 bg-purple-800 px-2 py-1 rounded-full">New</span>
                </div>
                <h3 className="text-sm font-medium text-purple-200 mb-1">매매일지</h3>
                <p className="text-2xl font-bold text-white">{journals?.length || 0}</p>
                <p className="text-xs text-purple-300 mt-1">작성된 일지</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-6 rounded-xl border border-orange-700 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <Target className="text-white" size={20} />
                  </div>
                  <span className="text-xs text-orange-300 bg-orange-800 px-2 py-1 rounded-full">Goal</span>
                </div>
                <h3 className="text-sm font-medium text-orange-200 mb-1">월간 목표</h3>
                <p className="text-2xl font-bold text-white">₩{(goals?.monthlyTarget || 1000000).toLocaleString()}</p>
                <p className="text-xs text-orange-300 mt-1">목표 수익률</p>
              </div>
            </div>
            
            {/* 최근 거래 */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-6">
              <h3 className="text-lg font-semibold mb-4">최근 거래</h3>
              {trades?.length > 0 ? (
                <div className="space-y-3">
                  {trades.slice(0, 5).map((trade, index) => (
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
            
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl inline-flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="font-semibold">✅ 더미 데이터로 테스트 중</p>
                <p className="text-green-100 text-sm">Convex 없이 정상 작동</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'trades' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">거래내역</h2>
              <button 
                onClick={() => setShowTradeForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                새 거래 추가
              </button>
            </div>
            
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
                          {trade.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            trade.type === 'buy' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                          }`}>
                            {trade.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {trade.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          ₩{trade.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          ₩{(trade.quantity * trade.price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {new Date(trade.date).toLocaleDateString('ko-KR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* 다른 탭들은 간단하게 */}
        {activeTab !== 'dashboard' && activeTab !== 'trades' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">{activeTab === 'portfolio' ? '포트폴리오' : activeTab === 'analytics' ? '분석' : activeTab === 'journal' ? '매매일지' : '목표관리'}</h2>
            <p className="text-slate-400">더미 데이터로 테스트 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}