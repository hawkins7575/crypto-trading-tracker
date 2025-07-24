import React from 'react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer } from 'recharts';

const MiniChart = ({ data, type = 'line', color = '#10B981', height = 60 }) => {
  if (!data || data.length === 0) return <div className="w-full h-full bg-slate-800 rounded flex items-center justify-center text-slate-500 text-xs">데이터 없음</div>;

  return (
    <ResponsiveContainer width="100%" height={height}>
      {type === 'line' ? (
        <LineChart data={data}>
          <Line 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      ) : (
        <BarChart data={data}>
          <Bar dataKey="value" fill={color} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
};

export default MiniChart;
