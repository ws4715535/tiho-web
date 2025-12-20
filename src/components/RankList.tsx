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
  const [arena, setArena] = useState<Arena>('大学城');
  const [month, setMonth] = useState<string>('2025年12月');
  const [week, setWeek] = useState<number | 'Monthly'>(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);

  // const [list, setList] = useState<Competitor[]>([]);
  // const [loading, setLoading] = useState(false);

  /*
  useEffect(() => {
    const parseMonth = (m: string) => {
      const mm = m.match(/^(\d{4})年(\d{1,2})月$/);
      return mm ? { year: parseInt(mm[1]), month: parseInt(mm[2]) } : null;
    };

    const load = async () => {
      setLoading(true);
      const parsed = parseMonth(month);
      if (!parsed) return;

      try {
        const storeId = arena === 'Arena A' ? STORES.UNIVERSITY_TOWN : STORES.LIJIACUN;
        
        const competitors = await externalRankService.fetchRank(
          parsed.year,
          parsed.month,
          week,
          storeId
        );
        
        setList(competitors);

      } catch (err) {
        console.error('Failed to fetch rank data:', err);
        setList([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [category, arena, month, week]);
  */

  const filteredData = useMemo(() => {
    // Temporary use hardcoded data
    let listData = getRankData(month, week, arena, category);

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      listData = listData.filter(item => 
        item.name.toLowerCase().includes(lower) || 
        item.teamName?.toLowerCase().includes(lower)
      );
    }
    
    return listData;
  }, [searchTerm, arena, month, week, category]);

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
             当前视图：{arena} • {month} • {week === 'Monthly' ? '全月' : `第 ${week} 周`}
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
        {/*
        {loading ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-sm">加载中...</p>
          </div>
        ) : filteredData.length > 0 ? (
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
        */}
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
