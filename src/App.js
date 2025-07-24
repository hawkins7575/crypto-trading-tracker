import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Download, Upload, FileText, Plus, Settings, Keyboard, Search, Edit, Trash2, MessageSquare, CheckCircle, Home, BarChart3, Activity, BookOpen, Brain, Calendar, TrendingUp, TrendingDown, DollarSign, Target, Wallet, Smartphone, X } from 'lucide-react';

// Hooks
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts';
import useSwipeGestures from './hooks/useSwipeGestures';
import useDragAndDrop from './hooks/useDragAndDrop';
import useSimpleLog from './hooks/useSimpleLog';
import useTradeCalculations from './hooks/useTradeCalculations';
import { useTradesData, useJournalsData, useStrategiesData, useGoalsData } from './hooks/useConvexData';

// Components
import Toast from './components/Toast';
import CircularProgress from './components/CircularProgress';
import MiniChart from './components/MiniChart';
import FloatingActionButton from './components/FloatingActionButton';
import SmartFilters from './components/SmartFilters';
import EnhancedTradingForm from './components/EnhancedTradingForm';
import EnhancedStatsCard from './components/EnhancedStatsCard';
import TradingJournal from './components/TradingJournal';
import TradingStrategies from './components/TradingStrategies';
import DragDropUpload from './components/DragDropUpload';
import EnhancedDashboard from './components/EnhancedDashboard';
import AnalyticsChart from './components/AnalyticsChart';
import ConvexStatus from './components/ConvexStatus';
import { GoalModal } from './components/GoalModal';
import { Header } from './components/Header';

export default function EnhancedCoinTradingTracker() {
  // Convex 데이터 훅 사용
  const { trades, recentTrades, addTrade: addTradeToDb, updateTrade: updateTradeInDb, deleteTrade: deleteTradeFromDb } = useTradesData();
  const { journals: tradingJournals, recentJournals, addJournal, updateJournal, deleteJournal } = useJournalsData();
  const { strategies: tradingStrategies, activeStrategies, addStrategy, updateStrategy, deleteStrategy } = useStrategiesData();
  const { goals, setGoals: updateGoals } = useGoalsData();
  const [currentTrade, setCurrentTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    entry: '',
    withdrawal: '',
    balance: '',
    profit: '',
    profitRate: '',
    memo: ''
  });
  const [viewMode, setViewMode] = useState('daily');
  const [showForm, setShowForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [currentMemo, setCurrentMemo] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  const { log } = useSimpleLog();
  const { calculateCumulativeData, calculateProfitAndRate, getStats, getRecentAmounts } = useTradeCalculations(trades);

  // 매매일지 저장
  const handleSaveJournal = useCallback(async (journalData) => {
    try {
      if (journalData.id && journalData._id) {
        // 수정
        await updateJournal({
          id: journalData._id,
          date: journalData.date,
          title: journalData.title,
          content: journalData.content,
          mood: journalData.mood,
          tags: journalData.tags,
        });
        log('매매일지가 수정되었습니다', 'success');
      } else {
        // 새로 추가
        await addJournal({
          date: journalData.date,
          title: journalData.title,
          content: journalData.content,
          mood: journalData.mood,
          tags: journalData.tags,
        });
        log('매매일지가 저장되었습니다', 'success');
      }
    } catch (error) {
      log('매매일지 저장 중 오류가 발생했습니다', 'error');
      console.error('Journal save error:', error);
    }
  }, [addJournal, updateJournal, log]);

  // 매매일지 삭제
  const handleDeleteJournal = useCallback(async (journalId) => {
    try {
      await deleteJournal({ id: journalId });
      log('매매일지가 삭제되었습니다', 'success');
    } catch (error) {
      log('매매일지 삭제 중 오류가 발생했습니다', 'error');
      console.error('Journal delete error:', error);
    }
  }, [deleteJournal, log]);

  // 매매전략 저장
  const handleSaveStrategy = useCallback(async (strategyData) => {
    try {
      if (strategyData.id && strategyData._id) {
        // 수정
        await updateStrategy({
          id: strategyData._id,
          title: strategyData.title,
          type: strategyData.type,
          entryCondition: strategyData.entryCondition,
          exitCondition: strategyData.exitCondition,
          stopLoss: strategyData.stopLoss,
          riskManagement: strategyData.riskManagement,
          description: strategyData.description,
          tags: strategyData.tags,
          isActive: strategyData.isActive,
        });
        log('매매전략이 수정되었습니다', 'success');
      } else {
        // 새로 추가
        await addStrategy({
          title: strategyData.title,
          type: strategyData.type,
          entryCondition: strategyData.entryCondition,
          exitCondition: strategyData.exitCondition,
          stopLoss: strategyData.stopLoss,
          riskManagement: strategyData.riskManagement,
          description: strategyData.description,
          tags: strategyData.tags,
          isActive: strategyData.isActive,
        });
        log('매매전략이 저장되었습니다', 'success');
      }
    } catch (error) {
      log('매매전략 저장 중 오류가 발생했습니다', 'error');
      console.error('Strategy save error:', error);
    }
  }, [addStrategy, updateStrategy, log]);

  // 매매전략 삭제
  const handleDeleteStrategy = useCallback(async (strategyId) => {
    try {
      await deleteStrategy({ id: strategyId });
      log('매매전략이 삭제되었습니다', 'success');
    } catch (error) {
      log('매매전략 삭제 중 오류가 발생했습니다', 'error');
      console.error('Strategy delete error:', error);
    }
  }, [deleteStrategy, log]);

  // 목표 저장
  const handleSaveGoals = useCallback(async (newGoals) => {
    try {
      await updateGoals({
        monthlyTarget: newGoals.monthlyTarget,
        weeklyTarget: newGoals.weeklyTarget,
        yearlyTarget: newGoals.yearlyTarget,
        targetWinRate: newGoals.targetWinRate,
      });
      log('목표가 저장되었습니다', 'success');
    } catch (error) {
      log('목표 저장 중 오류가 발생했습니다', 'error');
      console.error('Goals save error:', error);
    }
  }, [updateGoals, log]);

  // 키보드 단축키 설정
  useKeyboardShortcuts({
    'Ctrl+n': () => setShowForm(true),
    'Ctrl+s': () => showForm && handleSubmit(),
    'Ctrl+d': () => setActiveTab('dashboard'),
    'Ctrl+j': () => setActiveTab('journal'),
    'Ctrl+a': () => setActiveTab('analytics'),
    'Ctrl+t': () => setActiveTab('trades'),
    'Ctrl+r': () => setActiveTab('strategy'),
    'Escape': () => showForm && handleCancel(),
    'Ctrl+/': () => setShowShortcutsHelp(!showShortcutsHelp),
    'Ctrl+e': () => exportData(),
    'Ctrl+i': () => setShowImportExport(!showImportExport)
  });

  // 제스처 기반 네비게이션
  useSwipeGestures({
    onSwipeLeft: () => {
      const tabs = ['dashboard', 'analytics', 'trades', 'journal', 'strategy'];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      }
    },
    onSwipeRight: () => {
      const tabs = ['dashboard', 'analytics', 'trades', 'journal', 'strategy'];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      }
    }
  });

  // 필터링된 거래 데이터
  useEffect(() => {
    let filtered = [...trades];
    
    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(trade => 
        trade.memo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.date.includes(searchQuery)
      );
    }
    
    // 카테고리 필터
    switch (activeFilter) {
      case 'profit':
        filtered = filtered.filter(t => (t.profit || 0) > 0);
        break;
      case 'loss':
        filtered = filtered.filter(t => (t.profit || 0) < 0);
        break;
      case 'thisWeek':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filtered = filtered.filter(t => new Date(t.date) >= weekAgo);
        break;
      case 'large':
        filtered = filtered.filter(t => (t.entry || 0) >= 1000000);
        break;
    }
    
    setFilteredTrades(filtered);
  }, [trades, searchQuery, activeFilter]);

  // 폼 검증
  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!currentTrade.date) {
      errors.date = '날짜를 입력해주세요';
    }
    
    if (!currentTrade.balance) {
      errors.balance = '잔고를 입력해주세요';
    } else if (parseFloat(currentTrade.balance) < 0) {
      errors.balance = '잔고는 양수여야 합니다';
    }
    
    const entry = parseFloat(currentTrade.entry) || 0;
    const withdrawal = parseFloat(currentTrade.withdrawal) || 0;
    
    if (entry < 0) {
      errors.entry = '입금은 양수여야 합니다';
    }
    
    if (withdrawal < 0) {
      errors.withdrawal = '출금은 양수여야 합니다';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentTrade]);

  // 빠른 액션 처리
  const handleQuickAction = useCallback((action) => {
    const today = new Date().toISOString().split('T')[0];
    const lastBalance = trades.length > 0 ? trades[trades.length - 1].balance : 0;
    
    switch (action) {
      case 'deposit':
        setCurrentTrade({
          date: today,
          entry: '',
          withdrawal: '0',
          balance: lastBalance.toString(),
          profit: '',
          profitRate: '',
          memo: '입금'
        });
        break;
      case 'withdrawal':
        setCurrentTrade({
          date: today,
          entry: '0',
          withdrawal: '',
          balance: lastBalance.toString(),
          profit: '',
          profitRate: '',
          memo: '출금'
        });
        break;
      case 'balance':
        setCurrentTrade({
          date: today,
          entry: '0',
          withdrawal: '0',
          balance: '',
          profit: '',
          profitRate: '',
          memo: '잔고 업데이트'
        });
        break;
    }
    setShowForm(true);
  }, [trades]);

  // 거래 추가/수정
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      log('입력값을 확인해주세요', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const entry = parseFloat(currentTrade.entry) || 0;
      const withdrawal = parseFloat(currentTrade.withdrawal) || 0;
      const balance = parseFloat(currentTrade.balance);
      const currentDate = currentTrade.date;
      
      let prevBalance = 0;
      if (editingTrade) {
        // 수정 모드: 현재 거래를 제외하고 날짜 기준으로 직전 거래 찾기
        const otherTrades = trades.filter(trade => trade._id !== editingTrade._id);
        const tradesBeforeCurrentDate = otherTrades
          .filter(trade => trade.date < currentDate)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        prevBalance = tradesBeforeCurrentDate.length > 0 
          ? tradesBeforeCurrentDate[tradesBeforeCurrentDate.length - 1].balance 
          : 0;
      } else {
        // 새 거래 추가: 현재 날짜 이전의 가장 최근 거래 찾기
        const tradesBeforeCurrentDate = trades
          .filter(trade => trade.date < currentDate)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        prevBalance = tradesBeforeCurrentDate.length > 0 
          ? tradesBeforeCurrentDate[tradesBeforeCurrentDate.length - 1].balance 
          : 0;
      }
      
      const { profit, profitRate, error } = calculateProfitAndRate(entry, withdrawal, balance, prevBalance);
      
      if (error) {
        log(error, 'error');
        return;
      }

      if (editingTrade) {
        // 수정
        await updateTradeInDb({
          id: editingTrade._id,
          date: currentTrade.date,
          entry,
          withdrawal,
          balance,
          profit,
          profitRate,
          memo: currentTrade.memo || ''
        });
        log('거래가 성공적으로 수정되었습니다', 'success');
      } else {
        // 새로 추가
        await addTradeToDb({
          date: currentTrade.date,
          entry,
          withdrawal,
          balance,
          profit,
          profitRate,
          memo: currentTrade.memo || ''
        });
        log('거래가 성공적으로 추가되었습니다', 'success');
      }
      
      handleCancel();
      
    } catch (error) {
      log('거래 처리 중 오류가 발생했습니다', 'error');
      console.error('Trade submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentTrade, trades, editingTrade, validateForm, calculateProfitAndRate, addTradeToDb, updateTradeInDb, log]);

  // 폼 취소
  const handleCancel = useCallback(() => {
    setCurrentTrade({
      date: new Date().toISOString().split('T')[0],
      entry: '',
      withdrawal: '',
      balance: '',
      profit: '',
      profitRate: '',
      memo: ''
    });
    setEditingTrade(null);
    setShowForm(false);
    setFormErrors({});
  }, []);

  // 거래 수정 시작
  const startEditTrade = useCallback((trade) => {
    setEditingTrade(trade);
    setCurrentTrade({
      date: trade.date,
      entry: trade.entry.toString(),
      withdrawal: (trade.withdrawal || 0).toString(),
      balance: trade.balance.toString(),
      profit: trade.profit.toString(),
      profitRate: trade.profitRate.toString(),
      memo: trade.memo || ''
    });
    setShowForm(true);
  }, []);

  // 거래 삭제
  const deleteTrade = useCallback(async (id) => {
    const confirmed = window.confirm('이 거래를 삭제하시겠습니까?');
    if (confirmed) {
      try {
        await deleteTradeFromDb({ id });
        log('거래가 삭제되었습니다', 'success');
      } catch (error) {
        log('거래 삭제 중 오류가 발생했습니다', 'error');
        console.error('Trade delete error:', error);
      }
    }
  }, [deleteTradeFromDb, log]);

  // 드래그 앤 드롭 파일 처리
  const handleFileDrop = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          if (importedData.trades && Array.isArray(importedData.trades)) {
            const tradeCount = importedData.trades.length;
            const journalCount = (importedData.tradingJournals && Array.isArray(importedData.tradingJournals)) 
              ? importedData.tradingJournals.length : 0;
            const strategyCount = (importedData.tradingStrategies && Array.isArray(importedData.tradingStrategies)) 
              ? importedData.tradingStrategies.length : 0;
            
            let message = `${tradeCount}개의 거래`;
            if (journalCount > 0) message += `, ${journalCount}개의 매매일지`;
            if (strategyCount > 0) message += `, ${strategyCount}개의 매매전략`;
            message += '을 가져오시겠습니까?';
            
            const confirmed = window.confirm(message);
            
            if (confirmed) {
              // Convex에 거래 데이터 저장
              for (const trade of importedData.trades) {
                await addTradeToDb({
                  date: trade.date,
                  entry: parseFloat(trade.entry) || 0,
                  withdrawal: parseFloat(trade.withdrawal) || 0,
                  balance: parseFloat(trade.balance) || 0,
                  profit: parseFloat(trade.profit) || 0,
                  profitRate: parseFloat(trade.profitRate) || 0,
                  memo: trade.memo || ''
                });
              }
              
              // 매매일지 가져오기
              if (importedData.tradingJournals && Array.isArray(importedData.tradingJournals)) {
                for (const journal of importedData.tradingJournals) {
                  await addJournal({
                    date: journal.date,
                    title: journal.title || '',
                    content: journal.content || '',
                    mood: journal.mood || 'neutral',
                    tags: journal.tags || ''
                  });
                }
              }
              
              // 매매전략 가져오기
              if (importedData.tradingStrategies && Array.isArray(importedData.tradingStrategies)) {
                for (const strategy of importedData.tradingStrategies) {
                  await addStrategy({
                    title: strategy.title || '',
                    type: strategy.type || 'swing',
                    entryCondition: strategy.entryCondition || '',
                    exitCondition: strategy.exitCondition || '',
                    stopLoss: strategy.stopLoss || '',
                    riskManagement: strategy.riskManagement || '',
                    description: strategy.description || '',
                    tags: strategy.tags || '',
                    isActive: strategy.isActive !== undefined ? strategy.isActive : true
                  });
                }
              }
              
              let successMessage = `${tradeCount}개의 거래`;
              if (journalCount > 0) successMessage += `와 ${journalCount}개의 매매일지`;
              if (strategyCount > 0) successMessage += `와 ${strategyCount}개의 매매전략`;
              successMessage += '를 성공적으로 가져왔습니다';
              
              log(successMessage, 'success');
            }
          }
        } catch (error) {
          log('파일을 읽는 중 오류가 발생했습니다', 'error');
        }
      };
      reader.readAsText(file);
    } else {
      log('JSON 파일만 지원됩니다', 'error');
    }
  }, [addTradeToDb, addJournal, addStrategy, log]);

  // 데이터 내보내기
  const exportData = useCallback(() => {
    try {
      const dataToExport = {
        trades: trades,
        tradingJournals: tradingJournals,
        tradingStrategies: tradingStrategies,
        exportDate: new Date().toISOString(),
        version: "4.0"
      };
      
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `trading-data-enhanced-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      log('데이터를 성공적으로 내보냈습니다', 'success');
    } catch (error) {
      log('데이터 내보내기 중 오류가 발생했습니다', 'error');
    }
  }, [trades, tradingJournals, tradingStrategies, log]);

  // 수익/손실 자동 계산 - 직전 잔고 기준
  useEffect(() => {
    if (currentTrade.balance && (currentTrade.entry || currentTrade.withdrawal)) {
      const entry = parseFloat(currentTrade.entry) || 0;
      const withdrawal = parseFloat(currentTrade.withdrawal) || 0;
      const balance = parseFloat(currentTrade.balance) || 0;
      const currentDate = currentTrade.date;
      
      let prevBalance = 0;
      
      if (editingTrade) {
        // 수정 모드: 현재 거래를 제외하고 날짜 기준으로 직전 거래 찾기
        const otherTrades = trades.filter(trade => trade._id !== editingTrade._id);
        const tradesBeforeCurrentDate = otherTrades
          .filter(trade => trade.date < currentDate)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        prevBalance = tradesBeforeCurrentDate.length > 0 
          ? tradesBeforeCurrentDate[tradesBeforeCurrentDate.length - 1].balance 
          : 0;
      } else {
        // 새 거래 추가: 현재 날짜 이전의 가장 최근 거래 찾기
        const tradesBeforeCurrentDate = trades
          .filter(trade => trade.date < currentDate)
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        prevBalance = tradesBeforeCurrentDate.length > 0 
          ? tradesBeforeCurrentDate[tradesBeforeCurrentDate.length - 1].balance 
          : 0;
      }
      
      const { profit, profitRate } = calculateProfitAndRate(entry, withdrawal, balance, prevBalance);
      
      setCurrentTrade(prev => ({
        ...prev,
        profit: profit.toString(),
        profitRate: profitRate.toString()
      }));
    }
  }, [currentTrade.entry, currentTrade.withdrawal, currentTrade.balance, currentTrade.date, trades, editingTrade, calculateProfitAndRate]);

  const stats = { ...getStats, ...goals };
  const recentAmounts = getRecentAmounts;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* 플로팅 액션 버튼들 */}
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 flex flex-col gap-2 md:gap-3 z-40">
        <FloatingActionButton
          icon={<Plus size={20} />}
          onClick={() => setShowForm(true)}
          tooltip="새 거래 추가 (Ctrl+N)"
          className="bg-blue-600 hover:bg-blue-700"
        />
        <FloatingActionButton
          icon={<BarChart3 size={20} />}
          onClick={() => setActiveTab('dashboard')}
          tooltip="대시보드 (Ctrl+D)"
          className="bg-emerald-600 hover:bg-emerald-700"
        />
        <FloatingActionButton
          icon={<Download size={20} />}
          onClick={exportData}
          tooltip="데이터 내보내기 (Ctrl+E)"
          className="bg-amber-600 hover:bg-amber-700"
        />
        <FloatingActionButton
          icon={<Keyboard size={20} />}
          onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
          tooltip="단축키 도움말 (Ctrl+/)"
          className="bg-slate-600 hover:bg-slate-700"
        />
      </div>

      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 lg:space-y-8">
        {/* 헤더 */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 backdrop-blur-sm shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 md:mb-6 lg:mb-8 gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-xl md:rounded-2xl blur opacity-30"></div>
                <div className="relative bg-slate-900/80 p-3 md:p-4 rounded-lg md:rounded-xl border border-slate-700/50">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-1 md:mb-2 font-mono tracking-tight bg-gradient-to-r from-white via-blue-200 to-emerald-200 bg-clip-text text-transparent">
                    TRADING DESK
                  </h1>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                    <div className="px-2 md:px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full">
                      <span className="text-blue-300 text-xs md:text-sm font-bold uppercase tracking-wider">PRO v4.0</span>
                    </div>
                    <div className="hidden sm:block w-1 h-6 bg-gradient-to-b from-blue-400 to-emerald-400 rounded-full"></div>
                    <p className="text-slate-300 font-medium text-sm md:text-base">전문 암호화폐 거래 관리 플랫폼</p>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                <ConvexStatus />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full lg:w-auto">
              <button
                onClick={() => setShowGoalModal(true)}
                className="group flex-1 lg:flex-none bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 hover:scale-105 hover:shadow-xl shadow-emerald-500/20 transform"
              >
                <div className="p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                  <Target size={16} className="md:w-5 md:h-5" />
                </div>
                <span className="text-sm md:text-base">목표</span>
              </button>
              <button
                onClick={() => setShowImportExport(!showImportExport)}
                className="group flex-1 lg:flex-none bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 hover:scale-105 hover:shadow-xl border border-slate-600/30 transform"
              >
                <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                  <Settings size={16} className="md:w-5 md:h-5" />
                </div>
                <span className="text-sm md:text-base">설정</span>
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="group flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 hover:scale-105 hover:shadow-xl shadow-blue-500/20 transform"
              >
                <div className="p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                  <Plus size={16} className="md:w-5 md:h-5" />
                </div>
                <span className="text-sm md:text-base">새 거래</span>
              </button>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex border-b border-slate-600/50 overflow-x-auto bg-slate-900/30 rounded-lg md:rounded-xl p-1 md:p-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {[
              { id: 'dashboard', name: '대시보드', icon: Home, color: 'emerald' },
              { id: 'analytics', name: '분석', icon: BarChart3, color: 'purple' },
              { id: 'trades', name: '거래내역', icon: Activity, color: 'blue' },
              { id: 'journal', name: '매매일지', icon: BookOpen, color: 'amber' },
              { id: 'strategy', name: '매매전략', icon: Brain, color: 'rose' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-6 py-3 md:py-4 font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 md:gap-3 rounded-lg md:rounded-xl transform hover:scale-105 min-w-0 ${
                  activeTab === tab.id 
                    ? `bg-gradient-to-r from-${tab.color}-500/20 to-${tab.color}-400/20 text-${tab.color}-300 border border-${tab.color}-400/30 shadow-lg shadow-${tab.color}-500/20` 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
                }`}
              >
                <div className={`p-0.5 md:p-1 rounded-full ${
                  activeTab === tab.id 
                    ? `bg-${tab.color}-400/20` 
                    : 'bg-white/10 group-hover:bg-white/20'
                }`}>
                  <tab.icon size={16} className="md:w-[18px] md:h-[18px]" />
                </div>
                <span className="text-xs md:text-sm hidden sm:block">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 설정 패널 */}
        {showImportExport && (
          <div className="space-y-6">
            {/* 드래그 앤 드롭 영역 */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all border-slate-600 hover:border-slate-500`}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-blue-500', 'bg-blue-500/10');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-blue-500', 'bg-blue-500/10');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-blue-500', 'bg-blue-500/10');
                const files = Array.from(e.dataTransfer.files);
                handleFileDrop(files);
              }}
            >
              <Upload className="mx-auto mb-3 text-slate-400" size={32} />
              <p className="text-slate-300 font-medium mb-1">
                JSON 파일을 여기에 드래그하여 가져오기
              </p>
              <p className="text-slate-500 text-sm">
                또는 아래 버튼을 클릭하여 파일 선택
              </p>
            </div>
            
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">데이터 관리</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={exportData}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-lg font-medium transition-colors flex items-center gap-3"
              >
                <Download size={18} />
                JSON 백업
              </button>
              <button
                onClick={() => {
                  try {
                    const csvHeader = '날짜,입금,출금,잔고,손익,수익률,메모\n';
                    const csvData = trades.map(trade => 
                      `${trade.date},${trade.entry || 0},${trade.withdrawal || 0},${trade.balance},${trade.profit || 0},${trade.profitRate || 0},"${(trade.memo || '').replace(/"/g, '""')}"`
                    ).join('\n');
                    
                    const csvContent = '\uFEFF' + csvHeader + csvData;
                    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(csvBlob);
                    
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `trading-data-${new Date().toISOString().split('T')[0]}.csv`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    
                    log('CSV로 성공적으로 내보냈습니다', 'success');
                  } catch (error) {
                    log('CSV 내보내기 중 오류가 발생했습니다', 'error');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg font-medium transition-colors flex items-center gap-3"
              >
                <FileText size={18} />
                CSV 내보내기
              </button>
              <div 
                className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-lg font-medium transition-colors flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = (e) => handleFileDrop(Array.from(e.target.files));
                  input.click();
                }}
              >
                <Upload size={18} />
                데이터 가져오기
              </div>
              <button
                onClick={async () => {
                  const confirmClear = window.confirm(
                    '모든 거래 데이터, 매매일지, 매매전략을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.'
                  );
                  
                  if (confirmClear) {
                    try {
                      // 모든 거래 삭제
                      for (const trade of trades) {
                        await deleteTradeFromDb({ id: trade._id });
                      }
                      
                      // 모든 매매일지 삭제
                      for (const journal of tradingJournals) {
                        await deleteJournal({ id: journal._id });
                      }
                      
                      // 모든 매매전략 삭제
                      for (const strategy of tradingStrategies) {
                        await deleteStrategy({ id: strategy._id });
                      }
                      
                      log('모든 데이터가 성공적으로 삭제되었습니다', 'success');
                    } catch (error) {
                      log('데이터 삭제 중 오류가 발생했습니다', 'error');
                      console.error('Clear all data error:', error);
                    }
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg font-medium transition-colors flex items-center gap-3"
              >
                <Trash2 size={18} />
                모두 삭제
              </button>
            </div>
            </div>
          </div>
        )}

        {/* 거래 추가/수정 폼 */}
        {showForm && (
          <EnhancedTradingForm
            currentTrade={currentTrade}
            setCurrentTrade={setCurrentTrade}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            editingTrade={editingTrade}
            errors={formErrors}
            isSubmitting={isSubmitting}
            recentAmounts={recentAmounts}
            onQuickAction={handleQuickAction}
          />
        )}

        {/* 통합 대시보드 */}
        <div className="space-y-4 md:space-y-6">
          {/* 대시보드 및 통계 */}
          <div className="space-y-4 md:space-y-6">
            <EnhancedDashboard 
              stats={stats} 
              trades={trades}
            
            {/* 최근 거래 내역 */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3 md:gap-4">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">최근 거래 내역</h2>
                  <p className="text-slate-400 text-sm md:text-base">최근 10건의 거래 기록</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-48 md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="거래 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setActiveTab('trades')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm w-full sm:w-auto"
                  >
                    모두 보기
                  </button>
                </div>
              </div>
              
              <SmartFilters 
                trades={trades}
                onFilter={() => {}}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
              
              {filteredTrades.length > 0 ? (
                <div className="overflow-x-auto">
                  <div className="hidden md:block">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-slate-700">
                          <th className="text-left py-3 px-2 md:px-3 text-slate-400 font-medium uppercase tracking-wider text-xs">날짜</th>
                          <th className="text-right py-3 px-2 md:px-3 text-slate-400 font-medium uppercase tracking-wider text-xs">입금</th>
                          <th className="text-right py-3 px-2 md:px-3 text-slate-400 font-medium uppercase tracking-wider text-xs">출금</th>
                          <th className="text-right py-3 px-2 md:px-3 text-slate-400 font-medium uppercase tracking-wider text-xs">잔고</th>
                          <th className="text-right py-3 px-2 md:px-3 text-slate-400 font-medium uppercase tracking-wider text-xs">손익</th>
                          <th className="text-center py-3 px-2 md:px-3 text-slate-400 font-medium uppercase tracking-wider text-xs">작업</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTrades.slice(0, 10).map((trade) => (
                          <tr key={trade._id} className="border-b border-slate-700 hover:bg-slate-750 transition-colors">
                            <td className="py-3 px-2 md:px-3 text-white font-mono text-sm">{new Date(trade.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</td>
                            <td className="py-3 px-2 md:px-3 text-right text-blue-400 font-mono text-sm">
                              {trade.entry > 0 ? `+₩${(trade.entry/10000).toFixed(0)}만` : '-'}
                            </td>
                            <td className="py-3 px-2 md:px-3 text-right text-amber-400 font-mono text-sm">
                              {trade.withdrawal > 0 ? `-₩${(trade.withdrawal/10000).toFixed(0)}만` : '-'}
                            </td>
                            <td className="py-3 px-2 md:px-3 text-right font-mono font-bold text-white text-sm">
                              ₩{(trade.balance/10000).toFixed(0)}만
                            </td>
                            <td className={`py-3 px-2 md:px-3 text-right font-mono font-bold text-sm ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {trade.profit >= 0 ? '+' : ''}₩{(trade.profit/10000).toFixed(0)}만
                            </td>
                            <td className="py-3 px-2 md:px-3 text-center">
                              <div className="flex gap-1 justify-center">
                                {trade.memo && (
                                  <button
                                    onClick={() => {
                                      setCurrentMemo(trade.memo);
                                      setSelectedDate(new Date(trade.date));
                                      setShowMemoModal(true);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                                    title="메모 보기"
                                  >
                                    <MessageSquare size={14} />
                                  </button>
                                )}
                                <button
                                  onClick={() => startEditTrade(trade)}
                                  className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                  title="거래 수정"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => deleteTrade(trade._id)}
                                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                  title="거래 삭제"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* 모바일 카드 뷰 */}
                  <div className="md:hidden space-y-3">
                    {filteredTrades.slice(0, 10).map((trade) => (
                      <div key={trade._id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="font-mono text-white text-sm">
                            {new Date(trade.date).toLocaleDateString('ko-KR', { 
                              month: 'short', 
                              day: 'numeric',
                              weekday: 'short'
                            })}
                          </div>
                          <div className="flex gap-1">
                            {trade.memo && (
                              <button
                                onClick={() => {
                                  setCurrentMemo(trade.memo);
                                  setSelectedDate(new Date(trade.date));
                                  setShowMemoModal(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                                title="메모 보기"
                              >
                                <MessageSquare size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => startEditTrade(trade)}
                              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                              title="거래 수정"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => deleteTrade(trade._id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="거래 삭제"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {trade.entry > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">입금</span>
                              <span className="text-blue-400 font-mono">+₩{trade.entry.toLocaleString()}</span>
                            </div>
                          )}
                          {trade.withdrawal > 0 && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">출금</span>
                              <span className="text-amber-400 font-mono">-₩{trade.withdrawal.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-slate-400">잔고</span>
                            <span className="text-white font-mono font-bold">₩{trade.balance.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">손익</span>
                            <span className={`font-mono font-bold ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {trade.profit >= 0 ? '+' : ''}₩{trade.profit.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-lg mb-1">거래 없음</p>
                  <p className="text-sm">첫 거래를 추가하여 시작하세요</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 전체 거래 내역 탭 (숨김/표시) */}
        {activeTab === 'trades' && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">전체 거래 내역</h2>
                <p className="text-slate-400">모든 거래 활동의 완전한 기록</p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                대시보드로 돌아가기
              </button>
            </div>
            
            {filteredTrades.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-700">
                      <th className="text-left py-4 px-4 text-slate-400 font-medium uppercase tracking-wider text-sm">날짜</th>
                      <th className="text-right py-4 px-4 text-slate-400 font-medium uppercase tracking-wider text-sm">입금</th>
                      <th className="text-right py-4 px-4 text-slate-400 font-medium uppercase tracking-wider text-sm">출금</th>
                      <th className="text-right py-4 px-4 text-slate-400 font-medium uppercase tracking-wider text-sm">잔고</th>
                      <th className="text-right py-4 px-4 text-slate-400 font-medium uppercase tracking-wider text-sm">손익</th>
                      <th className="text-right py-4 px-4 text-slate-400 font-medium uppercase tracking-wider text-sm">수익률 %</th>
                      <th className="text-center py-4 px-4 text-slate-400 font-medium uppercase tracking-wider text-sm">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrades.map((trade) => (
                      <tr key={trade._id} className="border-b border-slate-700 hover:bg-slate-750 transition-colors">
                        <td className="py-4 px-4 text-white font-mono">{trade.date}</td>
                        <td className="py-4 px-4 text-right text-blue-400 font-mono">
                          {trade.entry > 0 ? `+₩${trade.entry.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-4 px-4 text-right text-amber-400 font-mono">
                          {trade.withdrawal > 0 ? `-₩${trade.withdrawal.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-bold text-white">
                          ₩{trade.balance.toLocaleString()}
                        </td>
                        <td className={`py-4 px-4 text-right font-mono font-bold ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {trade.profit >= 0 ? '+' : ''}₩{trade.profit.toLocaleString()}
                        </td>
                        <td className={`py-4 px-4 text-right font-mono font-bold ${trade.profitRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {trade.profitRate >= 0 ? '+' : ''}{trade.profitRate}%
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex gap-2 justify-center">
                            {trade.memo && (
                              <button
                                onClick={() => {
                                  setCurrentMemo(trade.memo);
                                  setSelectedDate(new Date(trade.date));
                                  setShowMemoModal(true);
                                }}
                                className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                                title="메모 보기"
                              >
                                <MessageSquare size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => startEditTrade(trade)}
                              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                              title="거래 수정"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteTrade(trade._id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                              title="거래 삭제"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400">
                <Calendar className="h-20 w-20 mx-auto mb-4 opacity-30" />
                <p className="text-xl mb-2">거래 없음</p>
                <p>첫 거래를 추가하여 시작하세요</p>
              </div>
            )}
          </div>
        )}

        {/* 분석 탭 */}
        {activeTab === 'analytics' && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">거래 분석</h2>
                <p className="text-slate-400">다양한 시간대별 성과 분석 및 차트</p>
              </div>
              <div className="flex gap-2 bg-slate-900 rounded-lg p-1">
                {[
                  { mode: 'daily', label: '일별' },
                  { mode: 'weekly', label: '주별' },
                  { mode: 'monthly', label: '월별' }
                ].map(({ mode, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      viewMode === mode 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            <AnalyticsChart trades={trades} viewMode={viewMode} />
          </div>
        )}

        {/* 매매일지 전체 보기 */}
        {activeTab === 'journal' && (
          <div className="mt-6">
            <TradingJournal 
              journals={tradingJournals}
              onSaveJournal={handleSaveJournal}
              onDeleteJournal={handleDeleteJournal}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
            />
          </div>
        )}

        {/* 매매전략 전체 보기 */}
        {activeTab === 'strategy' && (
          <div className="mt-6">
            <TradingStrategies 
              strategies={tradingStrategies}
              onSaveStrategy={handleSaveStrategy}
              onDeleteStrategy={handleDeleteStrategy}
            />
          </div>
        )}

        {/* 단축키 도움말 모달 */}
        {showShortcutsHelp && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <Keyboard size={24} />
                  키보드 단축키
                </h3>
                <button
                  onClick={() => setShowShortcutsHelp(false)}
                  className="text-slate-400 hover:text-white p-2"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">일반</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">새 거래</span>
                      <kbd className="bg-slate-700 px-2 py-1 rounded">Ctrl+N</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">저장</span>
                      <kbd className="bg-slate-700 px-2 py-1 rounded">Ctrl+S</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">취소</span>
                      <kbd className="bg-slate-700 px-2 py-1 rounded">Escape</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">내보내기</span>
                      <kbd className="bg-slate-700 px-2 py-1 rounded">Ctrl+E</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">가져오기</span>
                      <kbd className="bg-slate-700 px-2 py-1 rounded">Ctrl+I</kbd>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">탭 이동</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">대시보드</span>
                      <kbd className="bg-slate-700 px-2 py-1 rounded">Ctrl+D</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">분석</span>
                      <kbd className="bg-slate-700 px-2 py-1 rounded">Ctrl+A</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">거래내역</span>
                      <kbd className="bg-slate-700 px-2 py-1 rounded">Ctrl+T</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">매매일지</span>
                      <kbd className="bg-slate-700 px-2 py-1 rounded">Ctrl+J</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">매매전략</span>
                      <kbd className="bg-slate-700 px-2 py-1 rounded">Ctrl+R</kbd>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone size={18} className="text-blue-400" />
                  <span className="text-blue-400 font-medium">모바일 제스처</span>
                </div>
                <p className="text-slate-300 text-sm">
                  좌우 스와이프로 탭 전환, 드래그 앤 드롭으로 파일 업로드
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 메모 모달 */}
        {showMemoModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-white mb-4">
                거래 메모 - {selectedDate?.toLocaleDateString('ko-KR')}
              </h3>
              <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 mb-4">
                <p className="text-slate-300 whitespace-pre-wrap">{currentMemo}</p>
              </div>
              <button
                onClick={() => {
                  setShowMemoModal(false);
                  setCurrentMemo('');
                  setSelectedDate(null);
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full"
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {/* 목표 설정 모달 */}
        <GoalModal
          show={showGoalModal}
          onClose={() => setShowGoalModal(false)}
          onSave={handleSaveGoals}
          goals={goals}
        />
      </div>
    </div>
  );
}