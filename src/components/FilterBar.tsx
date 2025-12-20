import React, { useRef, useEffect } from 'react';
import { Search, Trophy, Users, MapPin, ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { RankCategory, Arena } from '../types';
// no external month list; manual month stepping via parsing
import { Button } from './ui/Button';
import { TabsList, TabsTrigger } from './ui/Tabs';
import { cn } from '../lib/utils';

interface FilterBarProps {
  category: RankCategory;
  setCategory: (c: RankCategory) => void;
  arena: Arena;
  setArena: (a: Arena) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  month: string;
  setMonth: (m: string) => void;
  week: number | 'Monthly';
  setWeek: (w: number | 'Monthly') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  category, setCategory, 
  arena, setArena,
  searchTerm, setSearchTerm,
  month, setMonth,
  week, setWeek
}) => {
  const weekContainerRef = useRef<HTMLDivElement>(null);
  
  const handleMonthChange = (direction: 'prev' | 'next') => {
      const m = month.match(/^(\d{4})年(\d{1,2})月$/);
      if (!m) return;
      let y = parseInt(m[1], 10);
      let mm = parseInt(m[2], 10);
      if (direction === 'prev') {
        mm -= 1;
        if (mm < 1) { mm = 12; y -= 1; }
      } else {
        mm += 1;
        if (mm > 12) { mm = 1; y += 1; }
      }
      setMonth(`${y}年${mm}月`);
  };

  // Logic to scroll selected week into view
  useEffect(() => {
    if (weekContainerRef.current) {
      const activeBtn = weekContainerRef.current.querySelector(`[data-active="true"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [week]);

  return (
    <div className="space-y-5 mb-6">
      
      {/* 1. Arena Switcher using UI Tabs */}
      <TabsList>
        {(['大学城', '李家村'] as Arena[]).map((a) => (
            <TabsTrigger
                key={a}
                active={arena === a}
                onClick={() => setArena(a)}
            >
                <MapPin className={cn("w-3 h-3 mr-1.5", arena === a ? 'fill-current' : '')} />
                {a}
            </TabsTrigger>
        ))}
      </TabsList>

      {/* 2. Date Controls */}
      <div className="flex flex-col space-y-3">
          {/* Month Navigation */}
          <div className="flex items-center justify-between px-1">
            <Button variant="ghost" size="icon" onClick={() => handleMonthChange('prev')}>
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2 text-slate-800 dark:text-white font-mono font-bold">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>{month}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleMonthChange('next')}>
                <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Week Scroller */}
          <div 
            ref={weekContainerRef}
            className="flex space-x-2 overflow-x-auto no-scrollbar pb-1 px-1 snap-x"
          >
            {[1, 2, 3, 4, 'Monthly'].map((w) => {
                const isSelected = week === w; 
                return (
                    <button
                        key={w}
                        data-week={w}
                        data-active={isSelected}
                        onClick={() => setWeek(w as number | 'Monthly')}
                        className={cn(
                            "shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap select-none snap-start",
                            isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20"
                            : "bg-transparent border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                        )}
                    >
                        {w === 'Monthly' ? '全月' : `第 ${w} 周`}
                    </button>
                )
            })}
          </div>
      </div>

      {/* 3. Category & Search */}
      <div className="flex gap-2">
        {/* Category Toggle */}
        <div className="flex bg-slate-200 dark:bg-slate-900 rounded-lg p-1 shrink-0">
           <button
             onClick={() => setCategory('individual')}
             className={cn(
               "h-8 w-10 flex items-center justify-center rounded-md transition-all",
               category === 'individual' 
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
             )}
             title="个人榜"
           >
             <Users className="w-4 h-4" />
           </button>
           <button
             onClick={() => setCategory('team')}
             className={cn(
               "h-8 w-10 flex items-center justify-center rounded-md transition-all",
               category === 'team' 
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
             )}
             title="战队榜"
           >
             <Trophy className="w-4 h-4" />
           </button>
        </div>
        
        {/* Search with Clear Button */}
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={category === 'individual' ? '搜索选手...' : '搜索战队...'}
            className="w-full h-10 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 dark:focus:border-indigo-500 rounded-lg pl-9 pr-8 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          
          {searchTerm && (
            <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
