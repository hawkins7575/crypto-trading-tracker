import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart, Area, AreaChart } from 'recharts';
import { processChartData, formatChartValue } from '../utils/chartUtils';

const AnalyticsChart = ({ trades, viewMode }) => {
  const chartData = useMemo(() => {
    return processChartData(trades, viewMode);
  }, [trades, viewMode]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-xl mb-2">분석할 데이터가 없습니다</p>
        <p className="text-sm">거래를 추가하면 차트가 표시됩니다</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl">
          <div className="mb-2">
            <p className="text-white font-medium">
              {viewMode === 'weekly' ? data.weekLabel : 
               viewMode === 'monthly' ? data.monthLabel : 
               new Date(label).toLocaleDateString('ko-KR')}
            </p>
          </div>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between items-center gap-4 mb-1">
              <span className="text-slate-300 text-sm" style={{ color: entry.color }}>
                {entry.name}
              </span>
              <span className="text-white font-mono font-medium">
                {entry.dataKey === 'profitRate' 
                  ? formatChartValue(entry.value, 'percentage')
                  : formatChartValue(entry.value, 'currency')
                }
              </span>
            </div>
          ))}
          {data.trades && (
            <div className="border-t border-slate-600 pt-2 mt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>거래 수:</span>
                <span>{data.trades}건</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const formatXAxisLabel = (value) => {
    if (viewMode === 'weekly') {
      const data = chartData.find(d => d.date === value);
      return data?.weekLabel || value;
    } else if (viewMode === 'monthly') {
      const data = chartData.find(d => d.date === value);
      return data?.monthLabel || value;
    } else {
      return new Date(value).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="space-y-6">
      {/* 수익률 추이 차트 */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
          누적 수익률 추이
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={formatXAxisLabel}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="profitRate" 
                stroke="#10b981" 
                strokeWidth={2}
                fill="url(#profitGradient)"
                name="수익률"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 손익 막대 차트 */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
          {viewMode === 'daily' ? '일별' : viewMode === 'weekly' ? '주별' : '월별'} 손익
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={formatXAxisLabel}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => `₩${(value/10000).toFixed(0)}만`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="profit" 
                name="손익"
                fill={(entry) => entry >= 0 ? '#10b981' : '#ef4444'}
                radius={[2, 2, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Bar key={`bar-${index}`} fill={entry.profit >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 복합 차트 - 잔고와 수익률 */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
          잔고 및 수익률 복합 차트
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={formatXAxisLabel}
              />
              <YAxis 
                yAxisId="balance"
                orientation="left"
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => `₩${(value/10000).toFixed(0)}만`}
              />
              <YAxis 
                yAxisId="rate"
                orientation="right"
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                yAxisId="balance"
                dataKey="balance" 
                fill="#8b5cf6" 
                fillOpacity={0.6}
                name="잔고"
                radius={[2, 2, 0, 0]}
              />
              <Line 
                yAxisId="rate"
                type="monotone" 
                dataKey="profitRate" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                name="수익률"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;