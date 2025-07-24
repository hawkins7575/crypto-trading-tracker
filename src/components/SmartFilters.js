import React from 'react';

const SmartFilters = ({ trades, onFilter, activeFilter, setActiveFilter }) => {
  const filters = [
    { id: 'all', label: '전체', icon: '', count: trades.length },
    { id: 'profit', label: '수익', icon: '', count: trades.filter(t => (t.profit || 0) > 0).length },
    { id: 'loss', label: '손실', icon: '', count: trades.filter(t => (t.profit || 0) < 0).length },
    { id: 'thisWeek', label: '이번 주', icon: '', count: trades.filter(t => {
      const tradeDate = new Date(t.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return tradeDate >= weekAgo;
    }).length },
    { id: 'large', label: '큰 거래', icon: '', count: trades.filter(t => (t.entry || 0) >= 1000000).length }
  ];

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => {
            setActiveFilter(filter.id);
            onFilter(filter.id);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
            activeFilter === filter.id 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          <span>{filter.icon}</span>
          <span>{filter.label}</span>
          <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{filter.count}</span>
        </button>
      ))}
    </div>
  );
};

export default SmartFilters;
