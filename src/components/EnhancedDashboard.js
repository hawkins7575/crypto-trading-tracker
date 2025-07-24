import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Wallet, DollarSign, TrendingUp, TrendingDown, Target, BarChart3, Clock } from 'lucide-react';
import CircularProgress from './CircularProgress';
import MiniChart from './MiniChart';
import EnhancedStatsCard from './EnhancedStatsCard';

const EnhancedDashboard = ({ stats, trades }) => {
  const [timeFrame, setTimeFrame] = useState('all');
  
  const cumulativeData = useMemo(() => {
    if (trades.length === 0) return [];
    
    let cumulativeProfit = 0;
    let totalInvested = 0;
    
    return trades.slice(-30).map((trade, index) => {
      cumulativeProfit += trade.profit || 0;
      totalInvested += trade.entry || 0;
      
      const cumulativeRate = totalInvested > 0 ? (cumulativeProfit / totalInvested) * 100 : 0;
      
      return {
        date: trade.date,
        value: cumulativeProfit,
        rate: cumulativeRate,
        balance: trade.balance || 0,
        tradeNumber: index + 1
      };
    });
  }, [trades]);

  const profitDistribution = useMemo(() => {
    const profits = trades.map(t => t.profit || 0);
    const positive = profits.filter(p => p > 0).length;
    const negative = profits.filter(p => p < 0).length;
    const neutral = profits.filter(p => p === 0).length;
    
    return [
      { name: '수익', value: positive, color: '#10B981' },
      { name: '손실', value: negative, color: '#EF4444' },
      { name: '보합', value: neutral, color: '#6B7280' }
    ];
  }, [trades]);

  return (
    <div className="space-y-8">
      {/* 시간대 선택 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-1 h-10 bg-gradient-to-b from-blue-400 via-purple-500 to-emerald-400 rounded-full"></div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight bg-gradient-to-r from-white via-blue-200 to-emerald-200 bg-clip-text text-transparent">
              포트폴리오 대시보드
            </h2>
            <p className="text-slate-400 font-medium mt-1">실시간 투자 성과 분석</p>
          </div>
        </div>
        <div className="flex gap-2 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-xl p-2 border border-slate-700/30">
          {[
            { key: 'all', label: '전체', color: 'blue' },
            { key: '1M', label: '1개월', color: 'emerald' },
            { key: '3M', label: '3개월', color: 'purple' },
            { key: '6M', label: '6개월', color: 'amber' }
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setTimeFrame(key)}
              className={`px-5 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                timeFrame === key 
                  ? `bg-gradient-to-r from-${color}-600 to-${color}-700 text-white shadow-lg shadow-${color}-500/20` 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 메인 통계 카드들 */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 rounded-3xl blur-3xl"></div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
          <EnhancedStatsCard
            icon={DollarSign}
            title="총 투자금"
            value={stats.totalInvested}
            prefix="₩"
            trend="neutral"
          />
          <EnhancedStatsCard
            icon={Wallet}
            title="포트폴리오 가치"
            value={stats.currentBalance}
            prefix="₩"
            trend={stats.totalProfit >= 0 ? 'up' : 'down'}
            target={stats.monthlyTarget}
          />
          <EnhancedStatsCard
            icon={stats.totalProfit >= 0 ? TrendingUp : TrendingDown}
            title="총 수익"
            value={Math.abs(stats.totalProfit)}
            prefix={stats.totalProfit >= 0 ? "+₩" : "-₩"}
            trend={stats.totalProfit >= 0 ? 'up' : 'down'}
            target={stats.weeklyTarget}
          />
          <EnhancedStatsCard
            icon={Target}
            title="승률"
            value={stats.winRate}
            suffix="%"
            trend={stats.winRate >= 50 ? 'up' : 'down'}
            target={stats.targetWinRate || 70}
          />
        </div>
      </div>

      {/* 진행률 표시기 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-emerald-400/30 rounded-2xl p-6 text-center backdrop-blur-sm hover:scale-105 hover:shadow-2xl shadow-emerald-500/10 transition-all duration-300 transform">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-emerald-400/5 to-transparent rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <CircularProgress 
              value={Math.min((Math.abs(stats.totalProfit) / stats.monthlyTarget) * 100, 100)} 
              color="#10B981"
            />
            <div className="mt-4 space-y-2">
              <p className="text-emerald-300 text-sm font-bold uppercase tracking-widest">월간 목표 달성률</p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto"></div>
              <p className="text-white font-mono text-xl font-black">₩{stats.monthlyTarget.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-blue-400/30 rounded-2xl p-6 text-center backdrop-blur-sm hover:scale-105 hover:shadow-2xl shadow-blue-500/10 transition-all duration-300 transform">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <CircularProgress 
              value={Math.min((stats.winRate / (stats.targetWinRate || 70)) * 100, 100)} 
              color="#3B82F6"
            />
            <div className="mt-4 space-y-2">
              <p className="text-blue-300 text-sm font-bold uppercase tracking-widest">목표 승률 달성률</p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
              <p className="text-white font-mono text-xl font-black">{(stats.targetWinRate || 70)}%</p>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-purple-400/30 rounded-2xl p-6 backdrop-blur-sm hover:scale-105 hover:shadow-2xl shadow-purple-500/10 transition-all duration-300 transform">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-transparent rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="mb-4">
              <h3 className="text-purple-300 text-sm font-bold uppercase tracking-widest mb-2">수익/손실 분포</h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"></div>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={profitDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  dataKey="value"
                >
                  {profitDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  formatter={(value, name) => [value, name]} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 메인 차트 */}
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-emerald-400 rounded-full"></div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">포트폴리오 성과</h3>
              <p className="text-slate-400 font-medium mt-1">누적 수익률 및 잔고 변화</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-xl backdrop-blur-sm">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-emerald-300 text-sm font-bold">실시간 데이터</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 bg-slate-700/30 px-3 py-2 rounded-lg">
              <Clock size={16} />
              <span className="text-sm font-medium">업데이트: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        {trades.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={cumulativeData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151', 
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value, name) => [
                  name === 'rate' ? `${value}%` : `₩${value.toLocaleString()}`,
                  name === 'rate' ? '수익률' : name === 'balance' ? '잔고' : '누적수익'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBalance)"
                name="balance"
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="rate"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">거래 데이터가 없습니다</p>
            <p className="text-sm">첫 거래를 추가하여 시작하세요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboard;
