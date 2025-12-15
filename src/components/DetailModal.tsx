import React from 'react';
import { Competitor } from '../types';
import { X, Trophy, AlertTriangle, Target, Activity, Users } from 'lucide-react';
import { cn } from '../lib/utils';

interface DetailModalProps {
  data: Competitor | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  const roleMap: Record<string, string> = {
      'Captain': '队长',
      'Vice': '副队长',
      'Member': '队员'
  };

  const trendMap: Record<string, string> = {
      'up': '上升',
      'down': '下降',
      'stable': '持平'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#131720] border-t sm:border border-slate-200 dark:border-slate-700 sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]">
        
        {/* Floating Close Button - Placed absolutely relative to the Modal Card, high Z-index */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/40 rounded-full text-slate-900 dark:text-white backdrop-blur-md transition-colors shadow-sm"
        >
            <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-100 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 p-6 relative overflow-hidden shrink-0">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 pointer-events-none">
                <Trophy className="w-32 h-32 text-slate-900 dark:text-white" />
            </div>

            <div className="relative z-10 pr-10">
                <div className="inline-block px-2 py-1 mb-2 bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 rounded text-[10px] text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-widest">
                    当前排名 #{data.rank}
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{data.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{data.teamName || '独立选手'}</p>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar">
            
            {/* Main Score Big */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                    <span className="text-xs text-slate-500 uppercase tracking-widest">总积分</span>
                    <div className={cn("text-4xl font-mono font-bold", data.totalScore > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400')}>
                        {data.totalScore > 0 ? '+' : ''}{data.totalScore}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs text-slate-500 uppercase tracking-widest">对局数</span>
                    <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                        {data.gamesPlayed}
                    </div>
                </div>
            </div>

            {/* Grid Stats */}
            <div className="p-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2 text-yellow-600 dark:text-yellow-400">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">和牌率</span>
                    </div>
                    <div className="text-xl font-mono text-slate-900 dark:text-white">{data.winRate}%</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 dark:bg-yellow-400 h-full" style={{ width: `${data.winRate}%` }} />
                    </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2 text-rose-500 dark:text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">放铳率</span>
                    </div>
                    <div className="text-xl font-mono text-slate-900 dark:text-white">{data.dealInRate}%</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 dark:bg-rose-400 h-full" style={{ width: `${data.dealInRate}%` }} />
                    </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2 text-blue-500 dark:text-blue-400">
                        <Target className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">平均顺位</span>
                    </div>
                    <div className="text-xl font-mono text-slate-900 dark:text-white">{data.avgOrder}</div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2 text-purple-500 dark:text-purple-400">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">近期走势</span>
                    </div>
                    <div className="text-xl font-mono text-slate-900 dark:text-white capitalize">{trendMap[data.trend] || data.trend}</div>
                </div>
            </div>

            {/* Place Distribution */}
            <div className="px-6 pb-6">
                <span className="text-xs text-slate-500 uppercase tracking-widest block mb-3">顺位分布</span>
                <div className="flex h-8 rounded-lg overflow-hidden font-mono text-[10px] font-bold text-slate-900 dark:text-black text-center leading-8 border border-slate-200 dark:border-transparent">
                    <div style={{ flex: data.top4Rates[0] || 1 }} className="bg-yellow-400">一位</div>
                    <div style={{ flex: data.top4Rates[1] || 1 }} className="bg-slate-300">二位</div>
                    <div style={{ flex: data.top4Rates[2] || 1 }} className="bg-amber-600 text-white">三位</div>
                    <div style={{ flex: data.top4Rates[3] || 1 }} className="bg-slate-700 text-white">四位</div>
                </div>
            </div>

            {/* Roster (Team Only) */}
            {data.members && (
                <div className="px-6 pb-8">
                    <div className="flex items-center space-x-2 mb-3 text-slate-400">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">现役成员</span>
                    </div>
                    <div className="space-y-2">
                        {data.members.map((member, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300">
                                        {member.avatarStr}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{member.name}</span>
                                </div>
                                <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded", 
                                    member.role === 'Captain' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 
                                    member.role === 'Vice' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                    'bg-slate-100 dark:bg-slate-700 text-slate-500'
                                )}>
                                    {roleMap[member.role] || member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};