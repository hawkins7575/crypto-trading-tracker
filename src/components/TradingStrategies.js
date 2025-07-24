import React, { useState } from 'react';
import { Plus, Edit, Trash2, Brain, X } from 'lucide-react';

const TradingStrategies = ({ strategies, onSaveStrategy, onDeleteStrategy }) => {
  const [showStrategyModal, setShowStrategyModal] = useState(false);
  const [currentStrategy, setCurrentStrategy] = useState({
    title: '',
    type: 'swing',
    entryCondition: '',
    exitCondition: '',
    stopLoss: '',
    riskManagement: '',
    description: '',
    tags: '',
    isActive: true
  });
  const [editingStrategy, setEditingStrategy] = useState(null);

  // 전략 저장
  const handleSaveStrategy = () => {
    if (!currentStrategy.title.trim()) {
      alert('전략 제목을 입력해주세요.');
      return;
    }
    
    const strategyData = {
      id: editingStrategy ? editingStrategy.id : Date.now(),
      title: currentStrategy.title,
      type: currentStrategy.type,
      entryCondition: currentStrategy.entryCondition,
      exitCondition: currentStrategy.exitCondition,
      stopLoss: currentStrategy.stopLoss,
      riskManagement: currentStrategy.riskManagement,
      description: currentStrategy.description,
      tags: currentStrategy.tags,
      isActive: currentStrategy.isActive,
      createdAt: editingStrategy ? editingStrategy.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSaveStrategy(strategyData);
    setShowStrategyModal(false);
    setCurrentStrategy({
      title: '',
      type: 'swing',
      entryCondition: '',
      exitCondition: '',
      stopLoss: '',
      riskManagement: '',
      description: '',
      tags: '',
      isActive: true
    });
    setEditingStrategy(null);
  };

  // 전략 수정 시작
  const startEditStrategy = (strategy) => {
    setEditingStrategy(strategy);
    setCurrentStrategy({
      title: strategy.title,
      type: strategy.type,
      entryCondition: strategy.entryCondition,
      exitCondition: strategy.exitCondition,
      stopLoss: strategy.stopLoss,
      riskManagement: strategy.riskManagement,
      description: strategy.description,
      tags: strategy.tags,
      isActive: strategy.isActive
    });
    setShowStrategyModal(true);
  };

  // 전략 삭제
  const handleDeleteStrategy = (strategyId) => {
    if (window.confirm('이 매매전략을 삭제하시겠습니까?')) {
      onDeleteStrategy(strategyId);
    }
  };

  // 전략 활성화/비활성화 토글
  const toggleStrategyStatus = (strategy) => {
    const updatedStrategy = {
      ...strategy,
      isActive: !strategy.isActive,
      updatedAt: new Date().toISOString()
    };
    onSaveStrategy(updatedStrategy);
  };

  const strategyTypes = [
    { value: 'swing', label: '스윙 트레이딩', emoji: '' },
    { value: 'scalping', label: '스캘핑', emoji: '⚡' },
    { value: 'day', label: '데이 트레이딩', emoji: '' },
    { value: 'position', label: '포지션 트레이딩', emoji: '️' },
    { value: 'arbitrage', label: '차익거래', emoji: '' },
    { value: 'momentum', label: '모멘텀', emoji: '' },
    { value: 'reversal', label: '역추세', emoji: '↩️' },
    { value: 'breakout', label: '돌파매매', emoji: '' }
  ];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">매매전략</h2>
          <p className="text-slate-400">체계적인 매매 전략 관리</p>
        </div>
        <button
          onClick={() => setShowStrategyModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          새 전략 추가
        </button>
      </div>

      {/* 전략 목록 */}
      {strategies.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {strategies.map((strategy) => (
            <div key={strategy.id} className={`border rounded-xl p-6 transition-all hover:border-slate-500 ${
              strategy.isActive ? 'bg-slate-700 border-slate-600' : 'bg-slate-800 border-slate-700 opacity-60'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {strategyTypes.find(t => t.value === strategy.type)?.emoji || ''}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white">{strategy.title}</h3>
                    <p className="text-slate-400 text-sm">
                      {strategyTypes.find(t => t.value === strategy.type)?.label || strategy.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStrategyStatus(strategy)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      strategy.isActive 
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-slate-600/20 text-slate-400 border border-slate-500/30'
                    }`}
                  >
                    {strategy.isActive ? '활성' : '비활성'}
                  </button>
                </div>
              </div>

              {strategy.description && (
                <p className="text-slate-300 text-sm mb-4 overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>{strategy.description}</p>
              )}

              {strategy.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {strategy.tags.split(',').map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-600">
                <span className="text-slate-400 text-xs">
                  {new Date(strategy.updatedAt).toLocaleDateString('ko-KR')} 업데이트
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditStrategy(strategy)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                    title="전략 수정"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteStrategy(strategy.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="전략 삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400">
          <Brain className="h-20 w-20 mx-auto mb-4 opacity-30" />
          <p className="text-xl mb-2">매매전략 없음</p>
          <p>첫 번째 매매전략을 추가해보세요</p>
        </div>
      )}

      {/* 전략 작성/수정 모달 */}
      {showStrategyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingStrategy ? '매매전략 수정' : '새 매매전략 작성'}
              </h3>
              <button
                onClick={() => {
                  setShowStrategyModal(false);
                  setEditingStrategy(null);
                  setCurrentStrategy({
                    title: '',
                    type: 'swing',
                    entryCondition: '',
                    exitCondition: '',
                    stopLoss: '',
                    riskManagement: '',
                    description: '',
                    tags: '',
                    isActive: true
                  });
                }}
                className="text-slate-400 hover:text-white p-2"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 왼쪽 컬럼 */}
              <div className="space-y-6">
                {/* 전략 제목 */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">전략 제목 *</label>
                  <input
                    type="text"
                    value={currentStrategy.title}
                    onChange={(e) => setCurrentStrategy({...currentStrategy, title: e.target.value})}
                    placeholder="예: RSI 과매도 매수전략"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 전략 유형 */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-3 uppercase tracking-wider">전략 유형</label>
                  <div className="grid grid-cols-2 gap-3">
                    {strategyTypes.map(type => (
                      <button
                        key={type.value}
                        onClick={() => setCurrentStrategy({...currentStrategy, type: type.value})}
                        className={`p-3 rounded-lg border text-sm flex items-center gap-2 transition-all ${
                          currentStrategy.type === type.value 
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                            : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <span>{type.emoji}</span>
                        <span className="font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 진입 조건 */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">진입 조건</label>
                  <textarea
                    value={currentStrategy.entryCondition}
                    onChange={(e) => setCurrentStrategy({...currentStrategy, entryCondition: e.target.value})}
                    placeholder="예: RSI 30 이하, MACD 골든크로스, 지지선 터치 시"
                    className="w-full h-24 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 손절 조건 */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">손절 조건</label>
                  <textarea
                    value={currentStrategy.stopLoss}
                    onChange={(e) => setCurrentStrategy({...currentStrategy, stopLoss: e.target.value})}
                    placeholder="예: 진입가 대비 -3%, 지지선 하향 돌파 시"
                    className="w-full h-24 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 오른쪽 컬럼 */}
              <div className="space-y-6">
                {/* 익절 조건 */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">익절 조건</label>
                  <textarea
                    value={currentStrategy.exitCondition}
                    onChange={(e) => setCurrentStrategy({...currentStrategy, exitCondition: e.target.value})}
                    placeholder="예: 진입가 대비 +10%, RSI 70 초과, 저항선 도달 시"
                    className="w-full h-24 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 리스크 관리 */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">리스크 관리</label>
                  <textarea
                    value={currentStrategy.riskManagement}
                    onChange={(e) => setCurrentStrategy({...currentStrategy, riskManagement: e.target.value})}
                    placeholder="예: 전체 자금의 2% 이하 투입, 1:2 손익비 유지"
                    className="w-full h-24 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 태그 */}
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">태그</label>
                  <input
                    type="text"
                    value={currentStrategy.tags}
                    onChange={(e) => setCurrentStrategy({...currentStrategy, tags: e.target.value})}
                    placeholder="RSI, 기술분석, 단기매매 (쉼표로 구분)"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 활성화 상태 */}
                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={currentStrategy.isActive}
                      onChange={(e) => setCurrentStrategy({...currentStrategy, isActive: e.target.checked})}
                      className="w-5 h-5 bg-slate-900 border border-slate-600 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-slate-300 font-medium">전략 활성화</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 전략 설명 */}
            <div className="mt-6">
              <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wider">전략 설명</label>
              <textarea
                value={currentStrategy.description}
                onChange={(e) => setCurrentStrategy({...currentStrategy, description: e.target.value})}
                placeholder="전략의 배경, 시장 상황, 주의사항 등을 자세히 설명하세요..."
                className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-4 text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSaveStrategy}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
              >
                {editingStrategy ? '전략 수정' : '전략 저장'}
              </button>
              <button
                onClick={() => {
                  setShowStrategyModal(false);
                  setEditingStrategy(null);
                  setCurrentStrategy({
                    title: '',
                    type: 'swing',
                    entryCondition: '',
                    exitCondition: '',
                    stopLoss: '',
                    riskManagement: '',
                    description: '',
                    tags: '',
                    isActive: true
                  });
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex-1"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradingStrategies;
