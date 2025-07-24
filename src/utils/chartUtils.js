// 차트 데이터 처리 유틸리티

export const processChartData = (trades, viewMode) => {
  if (!trades || trades.length === 0) return [];

  // 날짜순으로 정렬된 거래 데이터
  const sortedTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  switch (viewMode) {
    case 'daily':
      return processDailyData(sortedTrades);
    case 'weekly':
      return processWeeklyData(sortedTrades);
    case 'monthly':
      return processMonthlyData(sortedTrades);
    default:
      return processDailyData(sortedTrades);
  }
};

const processDailyData = (trades) => {
  const dailyData = new Map();
  
  // 각 거래의 누적 수익률 계산
  let totalInvested = 0;
  let cumulativeProfit = 0;
  
  trades.forEach((trade) => {
    const date = trade.date;
    totalInvested += trade.entry || 0;
    cumulativeProfit += trade.profit || 0;
    
    const profitRate = totalInvested > 0 ? (cumulativeProfit / totalInvested) * 100 : 0;
    
    dailyData.set(date, {
      date,
      profit: trade.profit || 0,
      profitRate: parseFloat(profitRate.toFixed(2)),
      cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
      balance: trade.balance,
      entry: trade.entry || 0,
      withdrawal: trade.withdrawal || 0
    });
  });
  
  return Array.from(dailyData.values());
};

const processWeeklyData = (trades) => {
  const weeklyData = new Map();
  
  let totalInvested = 0;
  let cumulativeProfit = 0;
  
  trades.forEach((trade) => {
    const date = new Date(trade.date);
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    totalInvested += trade.entry || 0;
    cumulativeProfit += trade.profit || 0;
    
    const profitRate = totalInvested > 0 ? (cumulativeProfit / totalInvested) * 100 : 0;
    
    if (weeklyData.has(weekKey)) {
      const existing = weeklyData.get(weekKey);
      weeklyData.set(weekKey, {
        ...existing,
        profit: existing.profit + (trade.profit || 0),
        profitRate: parseFloat(profitRate.toFixed(2)),
        cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
        balance: trade.balance,
        entry: existing.entry + (trade.entry || 0),
        withdrawal: existing.withdrawal + (trade.withdrawal || 0),
        trades: existing.trades + 1
      });
    } else {
      weeklyData.set(weekKey, {
        date: weekKey,
        weekLabel: `${weekStart.getMonth() + 1}/${weekStart.getDate()}`,
        profit: trade.profit || 0,
        profitRate: parseFloat(profitRate.toFixed(2)),
        cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
        balance: trade.balance,
        entry: trade.entry || 0,
        withdrawal: trade.withdrawal || 0,
        trades: 1
      });
    }
  });
  
  return Array.from(weeklyData.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const processMonthlyData = (trades) => {
  const monthlyData = new Map();
  
  let totalInvested = 0;
  let cumulativeProfit = 0;
  
  trades.forEach((trade) => {
    const date = new Date(trade.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    totalInvested += trade.entry || 0;
    cumulativeProfit += trade.profit || 0;
    
    const profitRate = totalInvested > 0 ? (cumulativeProfit / totalInvested) * 100 : 0;
    
    if (monthlyData.has(monthKey)) {
      const existing = monthlyData.get(monthKey);
      monthlyData.set(monthKey, {
        ...existing,
        profit: existing.profit + (trade.profit || 0),
        profitRate: parseFloat(profitRate.toFixed(2)),
        cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
        balance: trade.balance,
        entry: existing.entry + (trade.entry || 0),
        withdrawal: existing.withdrawal + (trade.withdrawal || 0),
        trades: existing.trades + 1
      });
    } else {
      monthlyData.set(monthKey, {
        date: monthKey,
        monthLabel: `${date.getFullYear()}년 ${date.getMonth() + 1}월`,
        profit: trade.profit || 0,
        profitRate: parseFloat(profitRate.toFixed(2)),
        cumulativeProfit: parseFloat(cumulativeProfit.toFixed(2)),
        balance: trade.balance,
        entry: trade.entry || 0,
        withdrawal: trade.withdrawal || 0,
        trades: 1
      });
    }
  });
  
  return Array.from(monthlyData.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

export const formatChartValue = (value, type = 'currency') => {
  if (type === 'currency') {
    return value >= 0 ? `+₩${Math.abs(value).toLocaleString()}` : `-₩${Math.abs(value).toLocaleString()}`;
  } else if (type === 'percentage') {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }
  return value;
};