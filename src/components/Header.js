
import { Home, BarChart3, Activity, Brain, Target, Plus, BookOpen } from 'lucide-react';
import { TABS } from '../utils/constants';

export const Header = ({ 
  activeTab, 
  setActiveTab, 
  setShowForm, 
  setShowStrategiesModal, 
  setShowGoalModal 
}) => {
  const tabs = [
    { id: TABS.DASHBOARD, name: '대시보드', icon: Home },
    { id: TABS.ANALYTICS, name: '분석', icon: BarChart3 },
    { id: TABS.TRADES, name: '거래내역', icon: Activity },
    { id: TABS.JOURNAL, name: '매매일지', icon: BookOpen },
  ];

  return (
    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-xl p-5">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-1 tracking-tight">
            트레이딩데스크 프로 <span className="text-blue-400 font-medium">v4.0</span>
          </h1>
          <p className="text-slate-400">전문 암호화폐 거래 관리 플랫폼</p>
        </div>
        
        <div className="flex gap-2 w-full lg:w-auto">
          <button
            onClick={() => setShowStrategiesModal(true)}
            className="flex-1 lg:flex-none bg-purple-500 hover:bg-purple-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center text-sm"
          >
            <Brain size={16} />
            전략
          </button>
          <button
            onClick={() => setShowGoalModal(true)}
            className="flex-1 lg:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center text-sm"
          >
            <Target size={16} />
            목표
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 lg:flex-none bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 justify-center text-sm"
          >
            <Plus size={16} />
            새 거래
          </button>
        </div>
      </div>

      <div className="flex border-b border-white/[0.08] overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 text-sm ${
              activeTab === tab.id 
                ? 'border-b-2 border-blue-400 text-blue-400 bg-blue-400/5' 
                : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <tab.icon size={16} />
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};
