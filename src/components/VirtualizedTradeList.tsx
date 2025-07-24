import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Trade } from '@/types';
import { Edit, Trash2, MessageSquare } from 'lucide-react';

interface TradeRowData {
  trades: Trade[];
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (id: number) => void;
  onShowMemo: (memo: string, date: Date) => void;
}

interface VirtualizedTradeListProps {
  trades: Trade[];
  onEditTrade: (trade: Trade) => void;
  onDeleteTrade: (id: number) => void;
  onShowMemo: (memo: string, date: Date) => void;
  height?: number;
}

// 스타일 상수들
const STYLES = {
  rowContainer: "border-b border-slate-700/30 hover:bg-gradient-to-r hover:from-slate-800/50 hover:to-slate-700/30 transition-all duration-200 group",
  grid: "grid grid-cols-7 items-center px-6 py-5 text-sm",
  dateText: "text-slate-200 font-mono text-base font-medium tracking-wide",
  positiveAmount: "inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30",
  positiveAmountText: "text-emerald-300 font-mono font-semibold text-sm",
  negativeAmount: "inline-flex items-center px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30",
  negativeAmountText: "text-amber-300 font-mono font-semibold text-sm",
  emptyValue: "text-slate-500 text-sm",
  balance: "font-mono font-bold text-white text-base bg-slate-700/50 px-3 py-1 rounded-lg inline-block",
  profitPositive: "inline-flex items-center px-3 py-1 rounded-full font-mono font-bold text-sm bg-emerald-500/20 border border-emerald-500/30 text-emerald-300",
  profitNegative: "inline-flex items-center px-3 py-1 rounded-full font-mono font-bold text-sm bg-red-500/20 border border-red-500/30 text-red-300",
  actionButtons: "flex gap-2 justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-200",
  memoButton: "p-2.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/20 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg",
  editButton: "p-2.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/20 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg",
  deleteButton: "p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/20 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg"
} as const;

interface TradeRowProps {
  index: number;
  style: React.CSSProperties;
  data: TradeRowData;
}

const TradeRow: React.FC<TradeRowProps> = React.memo(({ index, style, data }) => {
  const { trades, onEditTrade, onDeleteTrade, onShowMemo } = data;
  const trade = trades[index];

  const handleEditClick = useCallback(() => {
    onEditTrade(trade);
  }, [onEditTrade, trade]);

  const handleDeleteClick = useCallback(() => {
    onDeleteTrade(trade.id);
  }, [onDeleteTrade, trade.id]);

  const handleMemoClick = useCallback(() => {
    if (trade.memo) {
      onShowMemo(trade.memo, new Date(trade.date));
    }
  }, [onShowMemo, trade.memo, trade.date]);

  return (
    <div 
      style={style} 
      className={STYLES.rowContainer}
      role="row"
      tabIndex={0}
    >
      <div className={STYLES.grid}>
        <div className={STYLES.dateText} role="gridcell">
          {new Date(trade.date).toLocaleDateString('ko-KR', { 
            month: 'short', 
            day: 'numeric',
            weekday: 'short'
          })}
        </div>
        <div className="text-right" role="gridcell">
          {trade.entry > 0 ? (
            <div className={STYLES.positiveAmount}>
              <span className={STYLES.positiveAmountText}>
                +₩{trade.entry.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className={STYLES.emptyValue}>-</span>
          )}
        </div>
        <div className="text-right" role="gridcell">
          {trade.withdrawal > 0 ? (
            <div className={STYLES.negativeAmount}>
              <span className={STYLES.negativeAmountText}>
                -₩{trade.withdrawal.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className={STYLES.emptyValue}>-</span>
          )}
        </div>
        <div className="text-right" role="gridcell">
          <div className={STYLES.balance}>
            ₩{trade.balance.toLocaleString()}
          </div>
        </div>
        <div className="text-right" role="gridcell">
          <div className={trade.profit >= 0 ? STYLES.profitPositive : STYLES.profitNegative}>
            {trade.profit >= 0 ? '+' : ''}₩{trade.profit.toLocaleString()}
          </div>
        </div>
        <div className="text-right" role="gridcell">
          <div className={trade.profitRate >= 0 ? STYLES.profitPositive : STYLES.profitNegative}>
            {trade.profitRate >= 0 ? '+' : ''}{trade.profitRate}%
          </div>
        </div>
        <div className="text-center" role="gridcell">
          <div className={STYLES.actionButtons}>
            {trade.memo && (
              <button
                onClick={handleMemoClick}
                className={STYLES.memoButton}
                title="메모 보기"
                aria-label={`${new Date(trade.date).toLocaleDateString('ko-KR')} 거래 메모 보기`}
              >
                <MessageSquare size={16} />
              </button>
            )}
            <button
              onClick={handleEditClick}
              className={STYLES.editButton}
              title="거래 수정"
              aria-label={`${new Date(trade.date).toLocaleDateString('ko-KR')} 거래 수정하기`}
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDeleteClick}
              className={STYLES.deleteButton}
              title="거래 삭제"
              aria-label={`${new Date(trade.date).toLocaleDateString('ko-KR')} 거래 삭제하기`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export const VirtualizedTradeList: React.FC<VirtualizedTradeListProps> = ({
  trades,
  onEditTrade,
  onDeleteTrade,
  onShowMemo,
  height = 400
}) => {
  const itemData = useMemo(() => ({
    trades,
    onEditTrade,
    onDeleteTrade,
    onShowMemo
  }), [trades, onEditTrade, onDeleteTrade, onShowMemo]);

  if (trades.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-xl mb-2">거래 없음</p>
        <p>첫 거래를 추가하여 시작하세요</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/30" role="table" aria-label="거래 내역 테이블">
      {/* 헤더 */}
      <div className="grid grid-cols-7 border-b border-slate-600/50 px-6 py-5 bg-gradient-to-r from-slate-800/80 to-slate-700/60" role="row">
        <div className="text-slate-300 font-bold uppercase tracking-widest text-xs flex items-center gap-2" role="columnheader">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          날짜
        </div>
        <div className="text-right text-slate-300 font-bold uppercase tracking-widest text-xs flex items-center justify-end gap-2" role="columnheader">
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          입금
        </div>
        <div className="text-right text-slate-300 font-bold uppercase tracking-widest text-xs flex items-center justify-end gap-2" role="columnheader">
          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
          출금
        </div>
        <div className="text-right text-slate-300 font-bold uppercase tracking-widest text-xs flex items-center justify-end gap-2" role="columnheader">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          잔고
        </div>
        <div className="text-right text-slate-300 font-bold uppercase tracking-widest text-xs flex items-center justify-end gap-2" role="columnheader">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          손익
        </div>
        <div className="text-right text-slate-300 font-bold uppercase tracking-widest text-xs flex items-center justify-end gap-2" role="columnheader">
          <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
          수익률
        </div>
        <div className="text-center text-slate-300 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2" role="columnheader">
          <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
          작업
        </div>
      </div>
      
      {/* 가상화된 리스트 */}
      <List
        height={height}
        width="100%"
        itemCount={trades.length}
        itemSize={80}
        itemData={itemData}
        className="scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent"
      >
        {TradeRow}
      </List>
    </div>
  );
};