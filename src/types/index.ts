export interface Trade {
  id: number;
  date: string;
  entry: number;
  withdrawal: number;
  balance: number;
  profit: number;
  profitRate: number;
  memo?: string;
}

export interface TradingJournal {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 'positive' | 'neutral' | 'negative';
  tags: string;
  createdAt: string;
  updatedAt: string;
}

export interface TradingStrategy {
  id: string;
  title: string;
  type: 'swing' | 'day' | 'scalping' | 'position';
  entryCondition: string;
  exitCondition: string;
  stopLoss: string;
  riskManagement: string;
  description: string;
  tags: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TradeStats {
  totalProfit: number;
  totalInvested: number;
  totalWithdrawal: number;
  currentBalance: number;
  totalProfitRate: number;
  winRate: number;
  totalTrades: number;
  avgProfit: number;
  bestTrade: number;
  worstTrade: number;
  monthlyTarget: number;
  weeklyTarget: number;
}

export interface FormErrors {
  date?: string;
  entry?: string;
  withdrawal?: string;
  balance?: string;
}

export type ViewMode = 'daily' | 'weekly' | 'monthly';
export type ActiveTab = 'dashboard' | 'analytics' | 'trades' | 'journal' | 'strategy';
export type FilterType = 'all' | 'profit' | 'loss' | 'thisWeek' | 'large';
export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}