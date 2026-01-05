import React, { useState } from 'react';
import { Competitor } from '../types';
import { Crown, TrendingUp, Minus, TrendingDown, Users, ChevronDown, ChevronUp, Heart } from 'lucide-react';

interface TeamRankCardProps {
  data: Competitor;
  onClick: () => void;
}

export const TeamRankCard: React.FC<TeamRankCardProps> = ({ data, onClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const getRankColor = (rank: number) => {
    switch(rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-slate-400';
      case 3: return 'text-amber-700';
      default: return 'text-slate-300 dark:text-slate-600';
    }
  };

  const getBgStyle = (rank: number) => {
     if (rank === 1) return 'bg-gradient-to-br from-white to-yellow-50/50 dark:from-slate-800 dark:to-yellow-900/10 border-yellow-500/50';
     if (rank === 2) return 'bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-800/50 border-slate-300/50';
     if (rank === 3) return 'bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-800 dark:to-amber-900/10 border-amber-600/50';
     return 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  };

  const getContribution = (score: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((score / total) * 100);
  };

  const getScoreColor = (val: number) => {
    if (val > 0) return 'text-red-500 dark:text-red-400';
    if (val < 0) return 'text-green-500 dark:text-green-400';
    return 'text-slate-500 dark:text-slate-400';
  };

  return (
    <div 
      className={`relative group mb-4 rounded-2xl p-5 select-none overflow-hidden transition-all hover:shadow-lg border-2 ${getBgStyle(data.rank)}`}
    >
      {/* Background Decor */}
      <div className="absolute -right-6 -top-6 opacity-5 dark:opacity-10 transform rotate-12 transition-transform group-hover:rotate-6">
        <Users className="w-32 h-32" />
      </div>

      {/* Main Content (Click to Expand) */}
      <div 
        className="relative z-10 flex flex-col sm:flex-row items-center gap-6 cursor-pointer"
        onClick={handleToggleExpand}
      >
        {/* Rank & Avatar Section */}
        <div className="flex items-center gap-5 min-w-[120px]">
           <div className={`text-4xl font-black italic font-mono tracking-tighter ${getRankColor(data.rank)}`}>
             #{data.rank}
           </div>
           
           <div className="relative">
             {data.avatar ? (
                <img src={data.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-white dark:border-slate-600" />
             ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-indigo-500 shadow-md">
                    {data.name.charAt(0)}
                </div>
             )}
             {data.rank <= 3 && (
                 <div className="absolute -top-3 -right-3 bg-white dark:bg-slate-800 rounded-full p-1 shadow-sm border border-slate-100 dark:border-slate-600">
                     <Crown className={`w-4 h-4 ${getRankColor(data.rank)} fill-current`} />
                 </div>
             )}
           </div>
        </div>

        {/* Team Info & Members */}
        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                {data.name}
            </h3>
            
            {/* Members List (Simplified) */}
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                {/* Member 1 */}
                <div className="flex flex-col items-center">
                    <span>{data.member1}</span>
                    <div className="flex items-center gap-1 text-[10px]">
                        <span className={getScoreColor(getContribution(data.member1Stats?.totalPT || 0, data.totalPT))}>
                            {getContribution(data.member1Stats?.totalPT || 0, data.totalPT)}%
                        </span>
                        <span className={`font-mono ${getScoreColor(data.member1Stats?.totalPT || 0)}`}>
                            ({(data.member1Stats?.totalPT || 0) > 0 ? '+' : ''}{data.member1Stats?.totalPT || 0})
                        </span>
                    </div>
                </div>

                <Heart className="w-3 h-3 text-rose-500 fill-current animate-pulse mx-1" />

                {/* Member 2 */}
                <div className="flex flex-col items-center">
                    <span>{data.member2}</span>
                    <div className="flex items-center gap-1 text-[10px]">
                        <span className={getScoreColor(getContribution(data.member2Stats?.totalPT || 0, data.totalPT))}>
                            {getContribution(data.member2Stats?.totalPT || 0, data.totalPT)}%
                        </span>
                        <span className={`font-mono ${getScoreColor(data.member2Stats?.totalPT || 0)}`}>
                            ({(data.member2Stats?.totalPT || 0) > 0 ? '+' : ''}{data.member2Stats?.totalPT || 0})
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center gap-6 sm:gap-8 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-700 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto mt-2 sm:mt-0 justify-center sm:justify-end">
            <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">总积分</div>
                <div className={`text-xl font-black font-mono ${data.totalPT > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {data.totalPT > 0 ? '+' : ''}{data.totalPT}
                </div>
            </div>
            
            <div className="text-center">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">走势</div>
                <div className="flex items-center justify-center h-[28px]">
                    {data.trend === 'up' && <TrendingUp className="w-5 h-5 text-emerald-500" />}
                    {data.trend === 'down' && <TrendingDown className="w-5 h-5 text-rose-500" />}
                    {data.trend === 'stable' && <Minus className="w-5 h-5 text-slate-400" />}
                </div>
            </div>

            <div className="hidden sm:block text-slate-400">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
        </div>
      </div>

      {/* Expanded Content */}
      <div 
          className={`relative z-10 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 hidden'}`}
      >
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-3 text-center">
                 <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">总对局数</div>
                 <div className="font-bold text-slate-800 dark:text-white">{data.gamesPlayed}</div>
                 <div className="mt-1 flex justify-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{data.member1}: {data.member1Stats?.gamesPlayed ?? '-'}</span>
                    <span>{data.member2}: {data.member2Stats?.gamesPlayed ?? '-'}</span>
                 </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-3 text-center">
                 <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">一位率</div>
                 <div className="font-bold text-slate-800 dark:text-white">{data.winRate}%</div>
                 <div className="mt-1 flex justify-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{data.member1}: {data.member1Stats?.winRate ?? '-'}%</span>
                    <span>{data.member2}: {data.member2Stats?.winRate ?? '-'}%</span>
                 </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-3 text-center">
                 <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">平均顺位</div>
                 <div className="font-bold text-slate-800 dark:text-white">{data.avgOrder}</div>
                 <div className="mt-1 flex justify-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{data.member1}: {data.member1Stats?.avgOrder ?? '-'}</span>
                    <span>{data.member2}: {data.member2Stats?.avgOrder ?? '-'}</span>
                 </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-3 text-center">
                 <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">被飞率</div>
                 <div className="font-bold text-slate-800 dark:text-white">{data.flyRate}%</div>
                 <div className="mt-1 flex justify-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                    <span>{data.member1}: {data.member1Stats?.flyRate ?? '-'}%</span>
                    <span>{data.member2}: {data.member2Stats?.flyRate ?? '-'}%</span>
                 </div>
            </div>
         </div>
         
         <div className="mt-4 text-center">
             <button 
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
             >
                 查看完整详情 &gt;
             </button>
         </div>
      </div>
    </div>
  );
};
