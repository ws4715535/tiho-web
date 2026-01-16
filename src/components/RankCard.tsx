import React from 'react';
import { Competitor } from '../types';
import { ChevronRight, Crown } from 'lucide-react';

interface RankCardProps {
  data: Competitor;
  onClick: () => void;
  isTeam?: boolean;
}

export const RankCard: React.FC<RankCardProps> = ({ data, onClick, isTeam }) => {
  const getRankStyle = (rank: number) => {
    switch(rank) {
      case 1: return 'text-yellow-500 dark:text-yellow-400 drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] scale-110';
      case 2: return 'text-slate-400 dark:text-slate-300';
      case 3: return 'text-amber-600 dark:text-amber-700';
      default: return 'text-slate-400 dark:text-slate-500';
    }
  };

  const getBgStyle = (rank: number) => {
     if (rank === 1) return 'bg-white dark:bg-slate-800 border-l-4 border-yellow-500 shadow-md shadow-yellow-500/10 dark:shadow-none';
     return 'bg-white dark:bg-slate-800/80 border-l-4 border-transparent shadow-sm hover:shadow-md transition-all dark:hover:bg-slate-800';
  };

  const getNameClass = (rank: number) => {
    if (rank === 1) return 'font-extrabold text-base sm:text-lg tracking-tight medal-1';
    if (rank === 2) return 'font-extrabold text-base sm:text-lg tracking-tight medal-2';
    if (rank === 3) return 'font-extrabold text-base sm:text-lg tracking-tight medal-3';
    return 'font-bold text-slate-800 dark:text-slate-100 text-base sm:text-lg';
  };

  const getCrownColor = (rank: number) => {
    switch(rank) {
      case 1: return 'text-yellow-500 fill-yellow-500';
      case 2: return 'text-slate-400 fill-slate-400';
      case 3: return 'text-amber-600 fill-amber-600';
      default: return '';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`relative group mb-3 rounded-r-lg rounded-l-md p-3 sm:p-4 cursor-pointer select-none overflow-hidden transition-all slide-in-up ${getBgStyle(data.rank)} glow-card`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Rank Number */}
            <div className={`w-8 text-center font-black text-2xl italic font-mono ${getRankStyle(data.rank)}`}>
                {data.rank}
            </div>

            {/* Info */}
            <div className="flex items-center space-x-3">
                {/* Avatar with Crown */}
                <div className="relative flex-shrink-0">
                    {data.avatar ? (
                        <img src={data.avatar} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700" />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-500 dark:text-slate-400 border-2 border-slate-200 dark:border-slate-700">
                            {data.name.charAt(0)}
                        </div>
                    )}
                    {data.rank <= 3 && (
                        <div className="absolute -top-2 -right-1 transform rotate-12 drop-shadow-sm">
                            <Crown className={`w-5 h-5 ${getCrownColor(data.rank)}`} />
                        </div>
                    )}
                </div>

                <div className="flex flex-col h-12 justify-between py-0.5">
                    <div className="flex items-center space-x-2 leading-none">
                        <span className={getNameClass(data.rank)}>{data.name}</span>
                    </div>
                    {!isTeam && (
                        <span className="inline-flex items-center justify-start whitespace-nowrap w-fit leading-none text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        总分: {data.totalScore}
                        </span>
                    )}
                    {isTeam && data.members && (
                        <div className="flex items-center space-x-1">
                            {data.members.slice(0, 4).map((m, i) => (
                                <div key={i} className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-600" title={m.name}>
                                    {m.avatarStr}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Stats Right */}
        <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="text-right">
                <div className={`text-lg font-mono font-bold tracking-tight ${data.totalPT > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                    {data.totalPT > 0 ? '+' : ''}{parseFloat(data.totalPT.toFixed(1))} 
                </div>
                <div className="flex items-center justify-end space-x-2 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <span>总局: <span className="text-slate-600 dark:text-slate-200 font-bold">{data.gamesPlayed}</span></span>
                    <span>均顺: <span className="text-slate-600 dark:text-slate-200 font-bold">{data.avgOrder}</span></span>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
        </div>
      </div>

      {/* Mini Bar Visual for Win Rate (Decorative) */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-slate-100 dark:bg-slate-700 w-full mt-2 opacity-80">
        <div 
            className="h-full bg-indigo-500 progress-anim" 
            style={{ width: `${data.winRate}%` }}
        />
      </div>
    </div>
  );
};
