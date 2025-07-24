
import React, { useState, useEffect } from 'react';
import { Brain, Save, X, Plus, Edit, Trash2 } from 'lucide-react';

export const StrategiesModal = ({ show, onClose, strategies, onSave, onDelete }) => {
  const [currentStrategy, setCurrentStrategy] = useState(null);

  useEffect(() => {
    if (!show) {
      setCurrentStrategy(null);
    }
  }, [show]);

  if (!show) return null;

  const handleSave = () => {
    if (currentStrategy && currentStrategy.name) {
      onSave(currentStrategy);
      setCurrentStrategy(null);
    }
  };

  const startNewStrategy = () => {
    setCurrentStrategy({ id: null, name: '', description: '', entryCondition: '', exitCondition: '', isActive: true });
  };

  const startEditStrategy = (strategy) => {
    setCurrentStrategy(strategy);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 w-full max-w-2xl m-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">거래 전략 관리</h2>
              <p className="text-slate-400">나만의 거래 전략을 추가하고 관리하세요.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strategy List */}
          <div className="space-y-4 pr-4 border-r border-white/[0.08]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">전략 목록</h3>
              <button onClick={startNewStrategy} className="flex items-center gap-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors">
                <Plus size={16} /> 새 전략
              </button>
            </div>
            {strategies.length > 0 ? (
              strategies.map(strategy => (
                <div key={strategy.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{strategy.name}</p>
                    <p className="text-xs text-slate-400">{strategy.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEditStrategy(strategy)} className="p-2 text-slate-400 hover:text-blue-400"><Edit size={16} /></button>
                    <button onClick={() => onDelete(strategy.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">전략이 없습니다.</p>
            )}
          </div>

          {/* Strategy Form */}
          <div>
            {currentStrategy ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">{currentStrategy.id ? '전략 수정' : '새 전략 추가'}</h3>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">전략명</label>
                  <input
                    type="text"
                    placeholder="예: 5일선 돌파 매매"
                    value={currentStrategy.name}
                    onChange={(e) => setCurrentStrategy({ ...currentStrategy, name: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">설명</label>
                  <textarea
                    placeholder="전략에 대한 간단한 설명"
                    value={currentStrategy.description}
                    onChange={(e) => setCurrentStrategy({ ...currentStrategy, description: e.target.value })}
                    className="w-full h-20 bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white resize-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button onClick={() => setCurrentStrategy(null)} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">취소</button>
                  <button onClick={handleSave} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Save size={16} /> 저장
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-20">
                <p>왼쪽 목록에서 전략을 선택하여 수정하거나</p>
                <p>'새 전략' 버튼을 눌러 추가하세요.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
