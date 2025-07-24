import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Wallet, Save, X, BarChart3 } from 'lucide-react';

// 로컬 타입 정의 (TypeScript 없이 JS에서 사용하는 경우를 대비)
interface Trade {
  _id?: string;
  date: string;
  entry: number;
  withdrawal: number;
  balance: number;
  profit: number;
  profitRate: number;
  memo?: string;
}

interface FormErrors {
  [key: string]: string;
}

interface CurrentTrade {
  date: string;
  entry: string;
  withdrawal: string;
  balance: string;
  profit: string;
  profitRate: string;
  memo: string;
}

interface EnhancedTradingFormProps {
  currentTrade: CurrentTrade;
  setCurrentTrade: (trade: CurrentTrade) => void;
  onSubmit: () => void;
  onCancel: () => void;
  editingTrade: Trade | null;
  errors?: FormErrors;
  isSubmitting?: boolean;
  recentAmounts?: number[];
  onQuickAction: (action: 'deposit' | 'withdrawal' | 'balance') => void;
}

const EnhancedTradingForm: React.FC<EnhancedTradingFormProps> = ({ 
  currentTrade, 
  setCurrentTrade, 
  onSubmit, 
  onCancel, 
  editingTrade, 
  errors = {},
  isSubmitting = false,
  recentAmounts = [],
  onQuickAction
}) => {
  const [showCalculator, setShowCalculator] = useState(true);
  const [showAmountSuggestions, setShowAmountSuggestions] = useState(false);

  const quickAmounts = [10000, 50000, 100000, 500000, 1000000];

  // 실시간 계산 
  const calculatePreview = () => {
    const entry = parseFloat(currentTrade.entry) || 0;
    const withdrawal = parseFloat(currentTrade.withdrawal) || 0;
    const balance = parseFloat(currentTrade.balance) || 0;
    const prevBalance = 0; // 임시로 0으로 설정
    
    const netFlow = entry - withdrawal;
    const expectedBalance = prevBalance + netFlow;
    const profit = balance - expectedBalance;
    const profitRate = prevBalance + entry > 0 ? (profit / (prevBalance + entry)) * 100 : 0;
    
    return { profit, profitRate };
  };

  const { profit: previewProfit, profitRate: previewRate } = calculatePreview();

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-600/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {editingTrade ? '거래 수정' : '새 거래 추가'}
          </h2>
          <div className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full">
            <span className="text-blue-300 text-xs font-semibold uppercase tracking-wider">
              {editingTrade ? 'EDIT' : 'NEW'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className={`p-3 rounded-xl transition-all duration-200 ${
              showCalculator 
                ? 'text-blue-400 bg-blue-400/20 border border-blue-400/30 shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50 border border-slate-600/30'
            }`}
            title="계산기 토글"
          >
            <BarChart3 size={20} />
          </button>
          <div className="text-slate-300 text-sm font-medium">
            실시간 수익률 계산
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 메인 폼 영역 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 빠른 액션 버튼들 */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-slate-900/80 to-slate-800/60 rounded-2xl border border-slate-700/30 backdrop-blur-sm">
            <div className="text-center mb-3 col-span-3">
              <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider">빠른 액션</h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-2"></div>
            </div>
            <button
              onClick={() => onQuickAction('deposit')}
              className="group bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white p-4 rounded-xl font-semibold transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 hover:shadow-xl shadow-emerald-500/20"
              aria-label="입금만 하기"
            >
              <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                <ArrowDown size={20} />
              </div>
              <span className="text-sm">입금만</span>
            </button>
            <button
              onClick={() => onQuickAction('withdrawal')}
              className="group bg-gradient-to-br from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white p-4 rounded-xl font-semibold transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 hover:shadow-xl shadow-amber-500/20"
              aria-label="출금만 하기"
            >
              <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                <ArrowUp size={20} />
              </div>
              <span className="text-sm">출금만</span>
            </button>
            <button
              onClick={() => onQuickAction('balance')}
              className="group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-4 rounded-xl font-semibold transition-all duration-300 flex flex-col items-center gap-2 hover:scale-105 hover:shadow-xl shadow-blue-500/20"
              aria-label="잔고만 업데이트하기"
            >
              <div className="p-2 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                <Wallet size={20} />
              </div>
              <span className="text-sm">잔고 업데이트</span>
            </button>
          </div>

          {/* 폼 필드들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">날짜 *</label>
              <input
                type="date"
                value={currentTrade.date}
                onChange={(e) => setCurrentTrade({...currentTrade, date: e.target.value})}
                className={`w-full bg-slate-900 border rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.date ? 'border-red-500' : 'border-slate-600'
                }`}
                aria-label="거래 날짜"
                aria-describedby={errors.date ? "date-error" : undefined}
                aria-invalid={!!errors.date}
              />
              {errors.date && <p id="date-error" className="text-red-400 text-xs mt-2" role="alert">{errors.date}</p>}
            </div>
            
            <div className="relative">
              <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">입금</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₩</span>
                <input
                  type="number"
                  placeholder="0"
                  value={currentTrade.entry}
                  onChange={(e) => setCurrentTrade({...currentTrade, entry: e.target.value})}
                  onFocus={() => setShowAmountSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowAmountSuggestions(false), 200)}
                  className={`w-full bg-slate-900 border rounded-lg pl-8 pr-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.entry ? 'border-red-500' : 'border-slate-600'
                  }`}
                  aria-label="입금 금액"
                  aria-describedby={errors.entry ? "entry-error" : undefined}
                  aria-invalid={!!errors.entry}
                />
                {showAmountSuggestions && (recentAmounts.length > 0 || quickAmounts.length > 0) && (
                  <div className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-10 mt-1">
                    <div className="p-3">
                      <div className="text-xs text-slate-400 mb-2">빠른 선택</div>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {quickAmounts.map(amount => (
                          <button
                            key={amount}
                            onClick={() => setCurrentTrade({...currentTrade, entry: amount.toString()})}
                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded text-xs font-mono"
                          >
                            {amount.toLocaleString()}
                          </button>
                        ))}
                      </div>
                      {recentAmounts.length > 0 && (
                        <>
                          <div className="text-xs text-slate-400 mb-2">최근 사용</div>
                          {recentAmounts.map(amount => (
                            <button
                              key={amount}
                              onClick={() => setCurrentTrade({...currentTrade, entry: amount.toString()})}
                              className="block w-full text-left p-2 hover:bg-slate-700 rounded text-sm font-mono"
                            >
                              ₩{amount.toLocaleString()}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {errors.entry && <p id="entry-error" className="text-red-400 text-xs mt-2" role="alert">{errors.entry}</p>}
            </div>
            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">출금</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₩</span>
                <input
                  type="number"
                  placeholder="0"
                  value={currentTrade.withdrawal}
                  onChange={(e) => setCurrentTrade({...currentTrade, withdrawal: e.target.value})}
                  className={`w-full bg-slate-900 border rounded-lg pl-8 pr-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.withdrawal ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
              </div>
              {errors.withdrawal && <p className="text-red-400 text-xs mt-2">{errors.withdrawal}</p>}
            </div>
            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">잔고 *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₩</span>
                <input
                  type="number"
                  placeholder="현재 잔고"
                  value={currentTrade.balance}
                  onChange={(e) => setCurrentTrade({...currentTrade, balance: e.target.value})}
                  className={`w-full bg-slate-900 border rounded-lg pl-8 pr-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.balance ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
              </div>
              {errors.balance && <p className="text-red-400 text-xs mt-2">{errors.balance}</p>}
            </div>
            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">수익금</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₩</span>
                <input
                  type="text"
                  value={currentTrade.profit || 0}
                  readOnly
                  className={`w-full bg-slate-700 border border-slate-600 rounded-lg pl-8 pr-4 py-3 font-mono font-bold ${
                    parseFloat(currentTrade.profit) >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">수익률 %</label>
              <input
                type="text"
                value={`${currentTrade.profitRate || 0}%`}
                readOnly
                className={`w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 font-mono font-bold ${
                  parseFloat(currentTrade.profitRate) >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              />
            </div>
          </div>

          {/* 거래 메모 */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">거래 메모</label>
            <textarea
              placeholder="거래 분석, 시장 상황, 전략 메모 등을 입력하세요..."
              value={currentTrade.memo || ''}
              onChange={(e) => setCurrentTrade({...currentTrade, memo: e.target.value})}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 실시간 계산기 사이드바 */}
        {showCalculator && (
          <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 p-6 rounded-2xl sticky top-4 h-fit border border-slate-600/30 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30">
                <BarChart3 size={20} className="text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white">실시간 계산</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider">예상 수익</div>
                </div>
                <div className={`text-xl font-mono font-bold ${previewProfit >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {previewProfit >= 0 ? '+' : ''}₩{Math.abs(previewProfit).toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-600/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider">예상 수익률</div>
                </div>
                <div className={`text-xl font-mono font-bold ${previewRate >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                  {previewRate >= 0 ? '+' : ''}{previewRate.toFixed(2)}%
                </div>
              </div>
              {previewProfit !== 0 && (
                <div className="p-4 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-600/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider">손익비</div>
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-200">
                    {previewProfit > 0 ? `+${(previewProfit/1000).toFixed(1)}K` : `${(previewProfit/1000).toFixed(1)}K`}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-4 mt-8">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-1 flex items-center justify-center gap-3 hover:scale-105 hover:shadow-xl shadow-blue-500/20 transform"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-lg">처리 중...</span>
            </>
          ) : (
            <>
              <div className="p-1 bg-white/20 rounded-full">
                <Save size={20} />
              </div>
              <span className="text-lg">{editingTrade ? '거래 수정' : '거래 추가'}</span>
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 flex-1 flex items-center justify-center gap-3 hover:scale-105 hover:shadow-xl border border-slate-600/30 transform"
        >
          <div className="p-1 bg-white/10 rounded-full">
            <X size={20} />
          </div>
          <span className="text-lg">취소</span>
        </button>
      </div>
    </div>
  );
};

export default EnhancedTradingForm;
