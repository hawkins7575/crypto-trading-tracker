
import React, { useEffect, useCallback } from 'react';
import { useTrading } from '../context/TradingContext';
import { useToast } from '../hooks/useToast';
import { useTradeCalculations } from '../hooks/useTradeCalculations';
import { useTradeFilter } from '../hooks/useTradeFilter';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { Header } from './Header';
import { TradeForm } from './TradeForm';
import { EnhancedStatsCard } from './EnhancedStatsCard';
import { ChartSection } from './ChartSection';
import { AnalyticsTab } from './AnalyticsTab';
import { TradeList } from './TradeList';
import { Toast } from './Toast';
import { GoalModal } from './GoalModal';
import { StrategiesModal } from './StrategiesModal';
import { JournalTab } from './JournalTab';
import { TABS, ACTIONS } from '../utils/constants';
import { Wallet, DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';

const TradingTrackerContent = () => {
  const { state, dispatch } = useTrading();
  const { toasts, addToast, removeToast } = useToast();
  
  const {
    trades,
    goals,
    strategies,
    journalEntries,
    activeTab,
    filters,
    ui,
    editing,
    memo,
    journal
  } = state;

  const {
    showForm,
    showGoalModal,
    showStrategiesModal,
    showMemoModal
  } = ui;

  const {
    editingTrade,
    editingStrategy,
    currentTrade,
    currentStrategy
  } = editing;

  const { currentMemo, selectedDate } = memo;
  const { currentJournalEntry, selectedJournalDate } = journal;
  const { searchQuery, activeFilter } = filters;

  const { calculateCumulativeData, calculateProfitAndRate, getStats } = useTradeCalculations(trades, goals);
  const { filteredTrades } = useTradeFilter(trades, searchQuery, activeFilter);

  useKeyboardShortcuts({
    'Ctrl+n': () => dispatch({ type: ACTIONS.SET_SHOW_FORM, payload: true }),
    'Ctrl+s': () => showForm && handleSubmit(),
    'Ctrl+d': () => dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: TABS.DASHBOARD }),
    'Ctrl+a': () => dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: TABS.ANALYTICS }),
    'Ctrl+t': () => dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: TABS.TRADES }),
    'Escape': () => showForm && handleCancel()
  });

  useEffect(() => {
    if (currentTrade.balance) {
      const entry = parseFloat(currentTrade.entry) || 0;
      const withdrawal = parseFloat(currentTrade.withdrawal) || 0;
      const balance = parseFloat(currentTrade.balance) || 0;
      
      let prevBalance = 0;
      if (editingTrade) {
        const editIndex = trades.findIndex(trade => trade.id === editingTrade.id);
        prevBalance = editIndex > 0 ? trades[editIndex - 1].balance : 0;
      } else {
        prevBalance = trades.length > 0 ? trades[trades.length - 1].balance : 0;
      }
      
      const { profit, profitRate } = calculateProfitAndRate(entry, withdrawal, balance, prevBalance);
      
      dispatch({ 
        type: ACTIONS.SET_CURRENT_TRADE, 
        payload: {
          ...currentTrade,
          profit: profit.toString(),
          profitRate: profitRate.toString()
        }
      });
    }
  }, [currentTrade.entry, currentTrade.withdrawal, currentTrade.balance, trades, editingTrade, calculateProfitAndRate, dispatch]);

  const handleSubmit = useCallback(async () => {
    if (!currentTrade.balance) {
      addToast('잔고를 입력해주세요', 'error');
      return;
    }

    try {
      const entry = parseFloat(currentTrade.entry) || 0;
      const withdrawal = parseFloat(currentTrade.withdrawal) || 0;
      const balance = parseFloat(currentTrade.balance);
      
      let prevBalance = 0;
      if (editingTrade) {
        const editIndex = trades.findIndex(trade => trade.id === editingTrade.id);
        prevBalance = editIndex > 0 ? trades[editIndex - 1].balance : 0;
      } else {
        prevBalance = trades.length > 0 ? trades[trades.length - 1].balance : 0;
      }
      
      const { profit, profitRate, error } = calculateProfitAndRate(entry, withdrawal, balance, prevBalance);
      
      if (error) {
        addToast(error, 'error');
        return;
      }

      const tradeData = {
        id: editingTrade ? editingTrade.id : Date.now(),
        date: currentTrade.date,
        entry,
        withdrawal,
        balance,
        profit,
        profitRate,
        memo: currentTrade.memo || ''
      };

      if (editingTrade) {
        dispatch({ type: ACTIONS.UPDATE_TRADE, payload: tradeData });
        addToast('거래가 성공적으로 수정되었습니다', 'success');
      } else {
        dispatch({ type: ACTIONS.ADD_TRADE, payload: tradeData });
        addToast('거래가 성공적으로 추가되었습니다', 'success');
      }
      
      handleCancel();
      
    } catch (error) {
      addToast('거래 처리 중 오류가 발생했습니다', 'error');
    }
  }, [currentTrade, trades, editingTrade, calculateProfitAndRate, addToast, dispatch]);

  const handleCancel = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_EDITING });
    dispatch({ type: ACTIONS.SET_SHOW_FORM, payload: false });
  }, [dispatch]);

  const startEditTrade = useCallback((trade) => {
    dispatch({ type: ACTIONS.SET_EDITING_TRADE, payload: trade });
    dispatch({ 
      type: ACTIONS.SET_CURRENT_TRADE, 
      payload: {
        date: trade.date,
        entry: trade.entry.toString(),
        withdrawal: (trade.withdrawal || 0).toString(),
        balance: trade.balance.toString(),
        profit: trade.profit.toString(),
        profitRate: trade.profitRate.toString(),
        memo: trade.memo || ''
      }
    });
    dispatch({ type: ACTIONS.SET_SHOW_FORM, payload: true });
  }, [dispatch]);

  const deleteTrade = useCallback((id) => {
    const confirmed = window.confirm('이 거래를 삭제하시겠습니까?');
    if (confirmed) {
      dispatch({ type: ACTIONS.DELETE_TRADE, payload: id });
      addToast('거래가 삭제되었습니다', 'success');
    }
  }, [dispatch, addToast]);

  const handleSaveGoals = (newGoals) => {
    dispatch({ type: ACTIONS.SET_GOALS, payload: newGoals });
    addToast('목표가 저장되었습니다.', 'success');
  };

  const handleSaveStrategy = (strategy) => {
    if (strategy.id) {
      dispatch({ type: ACTIONS.UPDATE_STRATEGY, payload: strategy });
      addToast('전략이 수정되었습니다.', 'success');
    } else {
      dispatch({ type: ACTIONS.ADD_STRATEGY, payload: { ...strategy, id: Date.now() } });
      addToast('전략이 추가되었습니다.', 'success');
    }
  };

  const handleDeleteStrategy = (id) => {
    const confirmed = window.confirm('이 전략을 삭제하시겠습니까?');
    if (confirmed) {
      dispatch({ type: ACTIONS.DELETE_STRATEGY, payload: id });
      addToast('전략이 삭제되었습니다.', 'success');
    }
  };

  const stats = getStats;
  const cumulativeData = calculateCumulativeData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <Header
          activeTab={activeTab}
          setActiveTab={(tab) => dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab })}
          setShowForm={(show) => dispatch({ type: ACTIONS.SET_SHOW_FORM, payload: show })}
          setShowStrategiesModal={(show) => dispatch({ type: ACTIONS.SET_SHOW_STRATEGIES_MODAL, payload: show })}
          setShowGoalModal={(show) => dispatch({ type: ACTIONS.SET_SHOW_GOAL_MODAL, payload: show })}
        />

        <TradeForm
          showForm={showForm}
          currentTrade={currentTrade}
          setCurrentTrade={(trade) => dispatch({ type: ACTIONS.SET_CURRENT_TRADE, payload: trade })}
          editingTrade={editingTrade}
          formErrors={{}}
          isSubmitting={false}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        {activeTab === TABS.DASHBOARD && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <EnhancedStatsCard
                icon={Wallet}
                title="포트폴리오 가치"
                value={stats.currentBalance}
                prefix="₩"
                trend={stats.totalProfit >= 0 ? 'up' : 'down'}
                target={stats.monthlyTarget}
              />
              <EnhancedStatsCard
                icon={DollarSign}
                title="총 투자금"
                value={stats.totalInvested}
                prefix="₩"
                trend="neutral"
              />
              <EnhancedStatsCard
                icon={stats.totalProfit >= 0 ? TrendingUp : TrendingDown}
                title="총 수익"
                value={Math.abs(stats.totalProfit)}
                change={stats.totalProfitRate}
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
                target={stats.targetWinRate}
              />
            </div>

            <ChartSection
              trades={trades}
              cumulativeData={cumulativeData}
              stats={stats}
              setShowForm={(show) => dispatch({ type: ACTIONS.SET_SHOW_FORM, payload: show })}
            />
          </div>
        )}

        {activeTab === TABS.ANALYTICS && <AnalyticsTab />}

        {activeTab === TABS.TRADES && (
          <TradeList
            filteredTrades={filteredTrades}
            trades={trades}
            searchQuery={searchQuery}
            setSearchQuery={(query) => dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query })}
            startEditTrade={startEditTrade}
            deleteTrade={deleteTrade}
          />
        )}

        {activeTab === TABS.JOURNAL && (
          <JournalTab
            journalEntries={journalEntries}
            currentJournalEntry={currentJournalEntry}
            selectedJournalDate={selectedJournalDate}
            dispatch={dispatch}
            ACTIONS={ACTIONS}
          />
        )}
      </div>

      <GoalModal 
        show={showGoalModal}
        onClose={() => dispatch({ type: ACTIONS.SET_SHOW_GOAL_MODAL, payload: false })}
        onSave={handleSaveGoals}
        goals={goals}
      />

      <StrategiesModal
        show={showStrategiesModal}
        onClose={() => dispatch({ type: ACTIONS.SET_SHOW_STRATEGIES_MODAL, payload: false })}
        strategies={strategies}
        onSave={handleSaveStrategy}
        onDelete={handleDeleteStrategy}
      />

      <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 space-y-2 max-w-sm sm:max-w-md ml-auto">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            toast={toast} 
            onRemove={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

export default TradingTrackerContent;
