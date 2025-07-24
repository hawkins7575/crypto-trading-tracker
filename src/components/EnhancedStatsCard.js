import React from 'react';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

const EnhancedStatsCard = ({ icon: Icon, title, value, change, prefix = '', suffix = '', trend = 'neutral', target, miniChart }) => {
  const getCardTheme = () => {
    if (trend === 'up') return {
      gradient: 'from-emerald-500/10 via-emerald-400/5 to-transparent',
      border: 'border-emerald-400/30',
      iconBg: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20',
      iconColor: 'text-emerald-400',
      accentColor: 'text-emerald-300',
      glowColor: 'shadow-emerald-500/10'
    };
    if (trend === 'down') return {
      gradient: 'from-red-500/10 via-red-400/5 to-transparent',
      border: 'border-red-400/30',
      iconBg: 'bg-gradient-to-br from-red-500/20 to-red-600/20',
      iconColor: 'text-red-400',
      accentColor: 'text-red-300',
      glowColor: 'shadow-red-500/10'
    };
    return {
      gradient: 'from-blue-500/10 via-blue-400/5 to-transparent',
      border: 'border-blue-400/30',
      iconBg: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-400',
      accentColor: 'text-blue-300',
      glowColor: 'shadow-blue-500/10'
    };
  };

  const theme = getCardTheme();
  const progress = target ? Math.min((Math.abs(value) / target) * 100, 100) : 0;

  return (
    <div className={`group relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 border ${theme.border} rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl ${theme.glowColor} transform`}>
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
      
      {/* Sparkle decoration for active cards */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkles size={16} className={theme.iconColor} />
      </div>
      
      <div className="relative z-10">
        {/* Header section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`relative p-4 rounded-2xl ${theme.iconBg} border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
              <div className="absolute inset-0 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors"></div>
              <Icon className={`h-7 w-7 ${theme.iconColor} relative z-10`} />
            </div>
            <div>
              <h3 className="text-slate-300 text-sm font-bold uppercase tracking-widest mb-1">{title}</h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30"></div>
            </div>
          </div>
          {miniChart && (
            <div className="w-28 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              {miniChart}
            </div>
          )}
        </div>

        {/* Value section */}
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-white text-3xl font-mono font-black tracking-tight group-hover:text-slate-100 transition-colors">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </span>
          </div>
          
          {/* Change indicator */}
          {change !== undefined && (
            <div className={`flex items-center gap-2 ${theme.accentColor} bg-white/5 rounded-full px-3 py-1.5 w-fit`}>
              <div className={`p-1 rounded-full ${theme.iconBg}`}>
                {trend === 'up' && <TrendingUp size={14} />}
                {trend === 'down' && <TrendingDown size={14} />}
              </div>
              <span className="font-bold text-sm">{change >= 0 ? '+' : ''}{change}%</span>
            </div>
          )}
          
          {/* Progress bar */}
          {target && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">목표 진행률</span>
                <span className={`text-sm font-bold ${theme.accentColor}`}>{progress.toFixed(1)}%</span>
              </div>
              <div className="relative">
                <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
                      progress >= 100 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 
                      progress >= 50 ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 
                      'bg-gradient-to-r from-amber-500 to-amber-400'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedStatsCard;