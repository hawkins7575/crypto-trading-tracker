
import React from 'react';
import { Search, Edit, Trash2, Calendar } from 'lucide-react';

export const TradeList = ({ 
  filteredTrades, 
  trades,
  searchQuery, 
  setSearchQuery,
  startEditTrade,
  deleteTrade
}) => {
  return (
    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">거래 내역</h2>
          <p className="text-slate-400 text-lg">모든 거래 활동의 완전한 기록</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="거래 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="text-slate-400 text-sm whitespace-nowrap px-4 py-3 bg-slate-800/30 rounded-xl border border-slate-600/30">
            {filteredTrades.length} / {trades.length}건
          </div>
        </div>
      </div>
      
      {filteredTrades.length > 0 ? (
        <div className="space-y-4">
          <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <div className="text-slate-400 font-medium text-sm tracking-wide">날짜</div>
            <div className="text-slate-400 font-medium text-sm tracking-wide text-right">입금</div>
            <div className="text-slate-400 font-medium text-sm tracking-wide text-right">출금</div>
            <div className="text-slate-400 font-medium text-sm tracking-wide text-right">잔고</div>
            <div className="text-slate-400 font-medium text-sm tracking-wide text-right">손익</div>
            <div className="text-slate-400 font-medium text-sm tracking-wide text-right">수익률</div>
            <div className="text-slate-400 font-medium text-sm tracking-wide text-center">작업</div>
          </div>

          <div className="space-y-3">
            {filteredTrades.map((trade, index) => (
              <div 
                key={trade._id} 
                className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group"
              >
                <div className="md:hidden space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-mono font-semibold text-lg mb-1">{trade.date}</div>
                      <div className="flex items-center gap-3">
                        {trade.entry > 0 && (
                          <span className="text-blue-400 font-mono text-sm">+₩{trade.entry.toLocaleString()}</span>
                        )}
                        {trade.withdrawal > 0 && (
                          <span className="text-amber-400 font-mono text-sm">-₩{trade.withdrawal.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-mono font-bold text-lg">₩{trade.balance.toLocaleString()}</div>
                      <div className={`font-mono font-semibold ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {trade.profit >= 0 ? '+' : ''}₩{trade.profit.toLocaleString()} ({trade.profit >= 0 ? '+' : ''}{trade.profitRate}%)
                      </div>
                    </div>
                  </div>
                  
                  {trade.memo && (
                    <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <p className="text-slate-300 text-sm">{trade.memo}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditTrade(trade)}
                      className="flex-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      수정
                    </button>
                    <button
                      onClick={() => deleteTrade(trade._id)}
                      className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      삭제
                    </button>
                  </div>
                </div>

                <div className="hidden md:grid md:grid-cols-7 gap-4 items-center">
                  <div className="text-white font-mono font-semibold">{trade.date}</div>
                  <div className="text-right">
                    {trade.entry > 0 ? (
                      <span className="text-blue-400 font-mono font-semibold">+₩{trade.entry.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </div>
                  <div className="text-right">
                    {trade.withdrawal > 0 ? (
                      <span className="text-amber-400 font-mono font-semibold">-₩{trade.withdrawal.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-white font-mono font-bold text-lg">₩{trade.balance.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold text-lg ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.profit >= 0 ? '+' : ''}₩{trade.profit.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold ${trade.profitRate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {trade.profitRate >= 0 ? '+' : ''}{trade.profitRate}%
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => startEditTrade(trade)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-200"
                        title="거래 수정"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteTrade(trade._id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                        title="거래 삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {trade.memo && (
                  <div className="hidden md:block mt-4 pt-4 border-t border-white/[0.06]">
                    <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <p className="text-slate-300 text-sm leading-relaxed">{trade.memo}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-slate-800/30 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-slate-500" />
          </div>
          <p className="text-slate-400 text-xl mb-2">거래 없음</p>
          <p className="text-slate-500">첫 거래를 추가하여 시작하세요</p>
        </div>
      )}
    </div>
  );
};
