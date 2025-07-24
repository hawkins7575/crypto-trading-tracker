
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Plus } from 'lucide-react';
import { CircularProgress } from './CircularProgress';

export const ChartSection = ({ trades, cumulativeData, stats, setShowForm }) => {
  const profitDistribution = useMemo(() => {
    const profits = trades.map(t => t.profit || 0);
    const positive = profits.filter(p => p > 0).length;
    const negative = profits.filter(p => p < 0).length;
    const neutral = profits.filter(p => p === 0).length;
    
    return [
      { name: '수익', value: positive, color: '#34D399' },
      { name: '손실', value: negative, color: '#F87171' },
      { name: '보합', value: neutral, color: '#94A3B8' }
    ];
  }, [trades]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* 메인 성과 차트 */}
      <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">포트폴리오 성과</h3>
            <p className="text-slate-400 text-sm">시간별 수익률 변화</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-slate-400 text-xs">잔고</span>
            </div>
          </div>
        </div>
        
        {trades.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickMargin={8}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                  tickMargin={8}
                  tickFormatter={(value) => `₩${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    border: '1px solid rgba(148, 163, 184, 0.2)', 
                    borderRadius: '12px',
                    color: '#fff',
                    backdropFilter: 'blur(8px)',
                    fontSize: '13px'
                  }}
                  formatter={(value, name) => [
                    `₩${value.toLocaleString()}`,
                    '잔고'
                  ]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('ko-KR')}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#60A5FA" 
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorBalance)"
                  name="balance"
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-slate-800/30 flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-slate-500" />
            </div>
            <p className="text-slate-400 text-xl mb-2 font-medium">거래 데이터가 없습니다</p>
            <p className="text-slate-500 text-base">첫 거래를 추가하여 시작하세요</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <Plus size={18} />
              첫 거래 추가
            </button>
          </div>
        )}
      </div>

      {/* 사이드 패널 */}
      <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-white">성과 요약</h4>
          <div className="text-xs text-slate-500 bg-slate-800/30 px-2 py-1 rounded-lg">
            실시간
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {/* 목표 달성률 */}
          <div className="text-center group hover:scale-105 transition-transform duration-200">
            <div className="relative">
              <CircularProgress 
                value={Math.min((Math.abs(stats.totalProfit) / stats.monthlyTarget) * 100, 100)} 
                color="#34D399"
                size={90}
                strokeWidth={5}
              />
            </div>
            <p className="text-slate-400 text-xs mt-3 mb-1">목표 달성률</p>
            <p className="text-white font-semibold text-sm">₩{stats.monthlyTarget.toLocaleString()}</p>
            <div className="text-xs text-slate-500 mt-1">
              월간 목표
            </div>
          </div>

          {/* 승률 현황 */}
          <div className="text-center group hover:scale-105 transition-transform duration-200">
            <div className="relative">
              <CircularProgress 
                value={Math.min((stats.winRate / stats.targetWinRate) * 100, 100)} 
                color="#60A5FA"
                size={90}
                strokeWidth={5}
              />
            </div>
            <p className="text-slate-400 text-xs mt-3 mb-1">승률 현황</p>
            <p className="text-white font-semibold text-sm">{stats.winRate}% / {stats.targetWinRate}%</p>
            <div className="text-xs text-slate-500 mt-1">
              현재 / 목표
            </div>
          </div>

          {/* 거래 분포 */}
          <div className="text-center group hover:scale-105 transition-transform duration-200">
            <div className="h-24 mb-2 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={profitDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={45}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {profitDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                    formatter={(value, name) => [value, name]} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {trades.length}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs mb-1">거래 분포</p>
            <div className="flex justify-center gap-2 mb-1">
              {profitDistribution.slice(0, 2).map((entry, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-slate-400 text-xs">{entry.name}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-500">
              총 거래
            </div>
          </div>
        </div>
        
        {/* 추가 통계 정보 */}
        <div className="mt-6 pt-6 border-t border-white/[0.08]">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-800/30 rounded-lg">
              <div className="text-emerald-400 font-bold text-lg">
                ₩{Math.abs(stats.bestTrade).toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">최대 수익</div>
            </div>
            <div className="text-center p-3 bg-slate-800/30 rounded-lg">
              <div className="text-blue-400 font-bold text-lg">
                ₩{Math.abs(stats.avgProfit).toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">평균 수익</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
