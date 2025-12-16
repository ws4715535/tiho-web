import { useState, useMemo } from 'react';
import { Inbox } from 'lucide-react';
import { FilterBar } from '../components/FilterBar';
import { RankCard } from '../components/RankCard';
import { DetailModal } from '../components/DetailModal';
import { getRankData } from '../services/data';
import { Competitor, RankCategory, Arena } from '../types';

export const RankList = () => {
  // App State moved here
  const [category, setCategory] = useState<RankCategory>('individual');
  const [arena, setArena] = useState<Arena>('Arena A');
  const [month, setMonth] = useState<string>('2025年12月');
  const [week, setWeek] = useState<number | 'Monthly'>(2);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);

  const filteredData = useMemo(() => {
    let list = getRankData(month, week, arena, category);

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(lower) || 
        item.teamName?.toLowerCase().includes(lower)
      );
    }
    
    return list;
  }, [category, searchTerm, arena, month, week]);

  return (
    <>
      <div className="mb-6">
         <div className="flex items-baseline space-x-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  积分榜
              </h2>
              <span className="text-indigo-600 dark:text-indigo-400 text-sm font-mono font-bold tracking-tight">
                  2025 赛季
              </span>
         </div>
         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
             当前视图：{arena === 'Arena A' ? '大学城' : '李家村'} • {month} • {week === 'Monthly' ? '全月' : `第 ${week} 周`}
         </p>
      </div>

      <FilterBar 
        category={category} setCategory={setCategory}
        arena={arena} setArena={setArena}
        month={month} setMonth={setMonth}
        week={week} setWeek={setWeek}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
      />

      {/* List */}
      <div className="space-y-1 animate-in fade-in duration-500">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <RankCard 
              key={item.id} 
              data={item} 
              onClick={() => setSelectedCompetitor(item)}
              isTeam={category === 'team'}
            />
          ))
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">当前筛选条件下暂无比赛数据</p>
          </div>
        )}
      </div>

      <DetailModal 
        data={selectedCompetitor} 
        onClose={() => setSelectedCompetitor(null)} 
      />
    </>
  );
};
