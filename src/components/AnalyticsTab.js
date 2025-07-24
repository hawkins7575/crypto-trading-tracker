
import React from 'react';
import { BarChart3 } from 'lucide-react';

export const AnalyticsTab = () => {
  return (
    <div className="bg-white/[0.02] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8">
      <div className="text-center py-32">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/30 flex items-center justify-center">
          <BarChart3 className="h-10 w-10 text-slate-500" />
        </div>
        <p className="text-slate-400 text-2xl mb-3 font-medium">고급 분석 기능</p>
        <p className="text-slate-500 text-lg mb-6">상세한 분석 도구를 준비 중입니다</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mt-12">
          <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/30">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">손익분기점 분석</h3>
            <p className="text-slate-400 text-sm">투자 회수를 위한 최소 수익률 계산</p>
          </div>
          
          <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/30">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">리스크 관리</h3>
            <p className="text-slate-400 text-sm">포트폴리오 위험도 측정 및 관리</p>
          </div>
          
          <div className="bg-slate-800/20 rounded-xl p-6 border border-slate-700/30">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">성과 벤치마킹</h3>
            <p className="text-slate-400 text-sm">시장 대비 성과 비교 분석</p>
          </div>
        </div>
      </div>
    </div>
  );
};
