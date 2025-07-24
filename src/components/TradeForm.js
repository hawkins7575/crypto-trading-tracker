
import React from 'react';
import { Plus, Save, X } from 'lucide-react';

export const TradeForm = ({ 
  showForm, 
  currentTrade, 
  setCurrentTrade, 
  editingTrade, 
  formErrors, 
  isSubmitting, 
  onSubmit, 
  onCancel 
}) => {
  if (!showForm) return null;

  return (
    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Plus className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {editingTrade ? '거래 수정' : '새 거래'}
            </h2>
            <p className="text-slate-400">거래 정보를 입력하고 수익률을 확인하세요</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-3 tracking-wide">날짜 *</label>
          <input
            type="date"
            value={currentTrade.date}
            onChange={(e) => setCurrentTrade({...currentTrade, date: e.target.value})}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full bg-slate-800/50 border rounded-xl px-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              formErrors.date ? 'border-red-500' : 'border-slate-600/50'
            }`}
          />
          {formErrors.date && <p className="text-red-400 text-xs mt-2">{formErrors.date}</p>}
        </div>
        
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-3 tracking-wide">입금</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₩</span>
            <input
              type="number"
              placeholder="0"
              value={currentTrade.entry}
              onChange={(e) => setCurrentTrade({...currentTrade, entry: e.target.value})}
              className={`w-full bg-slate-800/50 border rounded-xl pl-8 pr-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                formErrors.entry ? 'border-red-500' : 'border-slate-600/50'
              }`}
            />
          </div>
          {formErrors.entry && <p className="text-red-400 text-xs mt-2">{formErrors.entry}</p>}
        </div>
        
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-3 tracking-wide">출금</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₩</span>
            <input
              type="number"
              placeholder="0"
              value={currentTrade.withdrawal}
              onChange={(e) => setCurrentTrade({...currentTrade, withdrawal: e.target.value})}
              className={`w-full bg-slate-800/50 border rounded-xl pl-8 pr-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                formErrors.withdrawal ? 'border-red-500' : 'border-slate-600/50'
              }`}
            />
          </div>
          {formErrors.withdrawal && <p className="text-red-400 text-xs mt-2">{formErrors.withdrawal}</p>}
        </div>
        
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-3 tracking-wide">잔고 *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₩</span>
            <input
              type="number"
              placeholder="현재 잔고"
              value={currentTrade.balance}
              onChange={(e) => setCurrentTrade({...currentTrade, balance: e.target.value})}
              className={`w-full bg-slate-800/50 border rounded-xl pl-8 pr-4 py-3 text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                formErrors.balance ? 'border-red-500' : 'border-slate-600/50'
              }`}
            />
          </div>
          {formErrors.balance && <p className="text-red-400 text-xs mt-2">{formErrors.balance}</p>}
        </div>
        
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-3 tracking-wide">수익금</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₩</span>
            <input
              type="text"
              value={currentTrade.profit || 0}
              readOnly
              className={`w-full bg-slate-700/50 border border-slate-600/30 rounded-xl pl-8 pr-4 py-3 font-mono font-bold ${
                parseFloat(currentTrade.profit) >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-3 tracking-wide">수익률 %</label>
          <input
            type="text"
            value={`${currentTrade.profitRate || 0}%`}
            readOnly
            className={`w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 font-mono font-bold ${
              parseFloat(currentTrade.profitRate) >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          />
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-slate-300 text-sm font-medium mb-3 tracking-wide">거래 메모</label>
        <textarea
          placeholder="거래 분석, 시장 상황, 전략 메모 등을 입력하세요..."
          value={currentTrade.memo || ''}
          onChange={(e) => setCurrentTrade({...currentTrade, memo: e.target.value})}
          className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-4 text-white h-28 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 flex-1 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              처리 중...
            </>
          ) : (
            <>
              <Save size={20} />
              {editingTrade ? '거래 수정' : '거래 추가'}
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 flex-1 flex items-center justify-center gap-3"
        >
          <X size={20} />
          취소
        </button>
      </div>
    </div>
  );
};
