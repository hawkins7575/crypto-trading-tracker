
import React, { useState, useEffect } from 'react';
import { Target, Save, X } from 'lucide-react';

export const GoalModal = ({ show, onClose, onSave, goals }) => {
  const [currentGoals, setCurrentGoals] = useState(goals);

  useEffect(() => {
    setCurrentGoals(goals);
  }, [goals]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentGoals(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSave = () => {
    onSave(currentGoals);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 w-full max-w-md m-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Target className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">목표 설정</h2>
              <p className="text-slate-400">거래 목표를 설정하여 성과를 추적하세요.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-3">월간 목표 수익</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₩</span>
              <input
                type="number"
                name="monthlyTarget"
                value={currentGoals.monthlyTarget}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-8 pr-4 py-3 text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-3">주간 목표 수익</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₩</span>
              <input
                type="number"
                name="weeklyTarget"
                value={currentGoals.weeklyTarget}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-8 pr-4 py-3 text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-3">연간 목표 수익</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">₩</span>
              <input
                type="number"
                name="yearlyTarget"
                value={currentGoals.yearlyTarget}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-8 pr-4 py-3 text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-3">목표 승률</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">%</span>
              <input
                type="number"
                name="targetWinRate"
                value={currentGoals.targetWinRate}
                onChange={handleChange}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-4">
          <button
            onClick={handleSave}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 flex-1 flex items-center justify-center gap-3"
          >
            <Save size={20} />
            저장
          </button>
          <button
            onClick={onClose}
            className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 flex-1 flex items-center justify-center gap-3"
          >
            <X size={20} />
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
