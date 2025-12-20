import { useState, useMemo, useEffect } from 'react';
import { Inbox } from 'lucide-react';
import { FilterBar } from '../components/FilterBar';
import { RankCard } from '../components/RankCard';
import { DetailModal } from '../components/DetailModal';
import { fetchRankData } from '../services/supabaseService';
import { getWeekDateRange, isWeekInProgress } from '../lib/utils';
import { Competitor, RankCategory, Arena } from '../types';

export const RankList = () => {
  // App State moved here
  const [category, setCategory] = useState<RankCategory>('individual');
  const [arena, setArena] = useState<Arena>('大学城');
  const [month, setMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}年${now.getMonth() + 1}月`;
  });
  const [week, setWeek] = useState<number | 'Monthly'>(() => {
    // Auto-select current week based on date
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    
    // Check weeks 1-4
    for (let w = 1; w <= 4; w++) {
      if (isWeekInProgress(y, m, w)) {
        return w;
      }
    }
    return 3; // Default fallback
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);

  const [list, setList] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const parseMonth = (m: string) => {
      const mm = m.match(/^(\d{4})年(\d{1,2})月$/);
      return mm ? { year: parseInt(mm[1]), month: parseInt(mm[2]) } : null;
    };

    const load = async () => {
      setLoading(true);
      
      // Temporary: Team ranking API is not ready yet.
      if (category === 'team') {
        setList([]);
        setLoading(false);
        return;
      }

      const parsed = parseMonth(month);
      if (!parsed) {
        setLoading(false);
        return;
      }

      try {
        const competitors = await fetchRankData(
          parsed.year,
          parsed.month,
          week,
          arena
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
  }, [arena, month, week, category]);

  const filteredData = useMemo(() => {
    let listData = list;

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      listData = listData.filter(item => 
        item.name.toLowerCase().includes(lower) || 
        item.teamName?.toLowerCase().includes(lower)
      );
    }
    
    return listData;
  }, [list, searchTerm]);

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
         <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
             结算规则：每周四截止统计。
             {week !== 'Monthly' && (() => {
               const mm = month.match(/^(\d{4})年(\d{1,2})月$/);
               if (mm) {
                 const year = parseInt(mm[1]);
                 const monthNum = parseInt(mm[2]);
                 return ` 本期时间（北京时间）：${getWeekDateRange(year, monthNum, week as number)}`;
               }
               return '';
             })()}
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
            <p className="text-sm">
              {category === 'team' 
                ? '双人成行❤️搭档立直赛 即将开启！' 
                : '当前筛选条件下暂无比赛数据'}
            </p>
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
