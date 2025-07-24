import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Trade, TradingJournal, TradingStrategy, ActiveTab, ViewMode, FilterType } from '@/types';

interface AppState {
  trades: Trade[];
  tradingJournals: TradingJournal[];
  tradingStrategies: TradingStrategy[];
  activeTab: ActiveTab;
  viewMode: ViewMode;
  activeFilter: FilterType;
  searchQuery: string;
  showForm: boolean;
  editingTrade: Trade | null;
}

type AppAction =
  | { type: 'SET_TRADES'; payload: Trade[] }
  | { type: 'ADD_TRADE'; payload: Trade }
  | { type: 'UPDATE_TRADE'; payload: Trade }
  | { type: 'DELETE_TRADE'; payload: number }
  | { type: 'SET_JOURNALS'; payload: TradingJournal[] }
  | { type: 'ADD_JOURNAL'; payload: TradingJournal }
  | { type: 'UPDATE_JOURNAL'; payload: TradingJournal }
  | { type: 'DELETE_JOURNAL'; payload: string }
  | { type: 'SET_STRATEGIES'; payload: TradingStrategy[] }
  | { type: 'ADD_STRATEGY'; payload: TradingStrategy }
  | { type: 'UPDATE_STRATEGY'; payload: TradingStrategy }
  | { type: 'DELETE_STRATEGY'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: ActiveTab }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'SET_ACTIVE_FILTER'; payload: FilterType }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SHOW_FORM'; payload: boolean }
  | { type: 'SET_EDITING_TRADE'; payload: Trade | null };

const initialState: AppState = {
  trades: [],
  tradingJournals: [],
  tradingStrategies: [],
  activeTab: 'dashboard',
  viewMode: 'daily',
  activeFilter: 'all',
  searchQuery: '',
  showForm: false,
  editingTrade: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_TRADES':
      return { ...state, trades: action.payload };
    case 'ADD_TRADE':
      return { 
        ...state, 
        trades: [...state.trades, action.payload].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      };
    case 'UPDATE_TRADE':
      return {
        ...state,
        trades: state.trades.map(trade => 
          trade.id === action.payload.id ? action.payload : trade
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      };
    case 'DELETE_TRADE':
      return {
        ...state,
        trades: state.trades.filter(trade => trade.id !== action.payload)
      };
    case 'SET_JOURNALS':
      return { ...state, tradingJournals: action.payload };
    case 'ADD_JOURNAL':
      return {
        ...state,
        tradingJournals: [...state.tradingJournals, action.payload].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      };
    case 'UPDATE_JOURNAL':
      return {
        ...state,
        tradingJournals: state.tradingJournals.map(journal =>
          journal.id === action.payload.id ? action.payload : journal
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      };
    case 'DELETE_JOURNAL':
      return {
        ...state,
        tradingJournals: state.tradingJournals.filter(journal => journal.id !== action.payload)
      };
    case 'SET_STRATEGIES':
      return { ...state, tradingStrategies: action.payload };
    case 'ADD_STRATEGY':
      return {
        ...state,
        tradingStrategies: [...state.tradingStrategies, action.payload].sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      };
    case 'UPDATE_STRATEGY':
      return {
        ...state,
        tradingStrategies: state.tradingStrategies.map(strategy =>
          strategy.id === action.payload.id ? action.payload : strategy
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      };
    case 'DELETE_STRATEGY':
      return {
        ...state,
        tradingStrategies: state.tradingStrategies.filter(strategy => strategy.id !== action.payload)
      };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    case 'SET_ACTIVE_FILTER':
      return { ...state, activeFilter: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SHOW_FORM':
      return { ...state, showForm: action.payload };
    case 'SET_EDITING_TRADE':
      return { ...state, editingTrade: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};