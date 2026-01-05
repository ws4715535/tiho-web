import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { FilterBar } from '../components/FilterBar';
import { RankCard } from '../components/RankCard';
import { TeamRankCard } from '../components/TeamRankCard';
import { DetailModal } from '../components/DetailModal';
import { TeamDetailModal } from '../components/TeamDetailModal';
import { fetchRankData, fetchExternalRankData } from '../services/supabaseService';
import { fetchAllTeams, updateTeamRankingDB } from '../services/teamService';
import { getWeekDateRange, calculateWeekRange, getWeeksInMonth } from '../lib/utils';
import { Competitor, RankCategory, Arena } from '../types';
import { getSeasonRule } from '../constants/season';

export const RankList = () => {
  // State Initializers that run once on mount
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<RankCategory>((searchParams.get('cat') as RankCategory) || 'individual');
  const [arena, setArena] = useState<Arena>('大学城');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor | null>(null);

  // Initialize date states
  const [month, setMonth] = useState<string>(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    for (let w = 1; w <= 5; w++) {
        const { startDate, endDate } = calculateWeekRange(currentYear, currentMonth, w);
        if (now >= startDate && now <= endDate) {
            return `${endDate.getFullYear()}年${endDate.getMonth() + 1}月`;
        }
    }

    return `${currentYear}年${currentMonth}月`;
  });

  const [week, setWeek] = useState<number | 'Monthly'>(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    let targetYear = currentYear;
    let targetMonth = currentMonth;
    
    for (let w = 1; w <= 5; w++) {
        const { startDate, endDate } = calculateWeekRange(currentYear, currentMonth, w);
        if (now >= startDate && now <= endDate) {
             targetYear = endDate.getFullYear();
             targetMonth = endDate.getMonth() + 1;
             break;
        }
    }
    
    for (let w = 1; w <= 5; w++) {
        const { startDate, endDate } = calculateWeekRange(targetYear, targetMonth, w);
        if (now >= startDate && now <= endDate) {
            return w;
        }
    }
    
    if (now.getDate() < 7) return 1;
    if (now.getDate() > 21) return 4;
    return 1;
  });

  const [list, setList] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Cache teams locally within component session if needed, but service handles it better
  // Just rely on service caching.

  // Effect to load data when filters change
  useEffect(() => {
    const parseMonth = (m: string) => {
      const mm = m.match(/^(\d{4})年(\d{1,2})月$/);
      return mm ? { year: parseInt(mm[1]), month: parseInt(mm[2]) } : null;
    };

    const load = async () => {
      setLoading(true);
      
      const controller = new AbortController();

      try {
        let competitors: Competitor[] = [];

        if (category === 'team') {
            // 0. Initialize: Fetch Teams (Cached in service)
            const teams = await fetchAllTeams();
            
            // 1. Data Query: Fetch external data for both arenas
            const parsed = parseMonth(month);
            if (!parsed) {
                setLoading(false);
                return;
            }

            // 2. Get Date Range
            let dateRange = '';
            if (week === 'Monthly') {
                const totalWeeks = getWeeksInMonth(parsed.year, parsed.month);
                const { startDate } = calculateWeekRange(parsed.year, parsed.month, 1);
                const { endDate } = calculateWeekRange(parsed.year, parsed.month, totalWeeks);
                
                const formatDate = (d: Date) => {
                  const y = d.getFullYear();
                  const m = (d.getMonth() + 1).toString().padStart(2, '0');
                  const dd = d.getDate().toString().padStart(2, '0');
                  return `${y}-${m}-${dd}`;
                };
                dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;
            } else {
                dateRange = getWeekDateRange(parsed.year, parsed.month, week).replace(/\//g, '-');
            }

            // Fetch from both arenas in parallel
            // Store IDs: University Town = 127, Lijiacun = 30
            // Using getStoreConfig for safe ID retrieval if possible, or hardcode known ones.
            const arena1Id = '127';
            const arena2Id = '30';

            const [data1, data2] = await Promise.all([
                fetchExternalRankData(dateRange, arena1Id, 200, controller.signal).catch(e => {
                    console.error('Failed to fetch arena 1:', e);
                    return { list: [] };
                }),
                fetchExternalRankData(dateRange, arena2Id, 200, controller.signal).catch(e => {
                    console.error('Failed to fetch arena 2:', e);
                    return { list: [] };
                })
            ]);

            // 2. Data Integration
            // Map<name, { ...stats, fourth: number, busted: number }>
            const playerStats = new Map<string, { 
                totalScore: number; 
                totalPT: number; 
                games: number;
                first: number;
                second: number;
                third: number;
                fourth: number;
                busted: number;
            }>();

            const processRecord = (record: any) => {
                if (!record || !record.username) return;
                const name = record.username;
                const stats = playerStats.get(name) || { 
                    totalScore: 0, totalPT: 0, games: 0,
                    first: 0, second: 0, third: 0, fourth: 0, busted: 0
                };
                
                stats.games += Number(record.total || 0);
                stats.totalScore += Number(record.score || 0);
                stats.totalPT += Number(record.point || 0);
                stats.first += Number(record.one || 0);
                stats.second += Number(record.two || 0);
                stats.third += Number(record.three || 0);
                stats.fourth += Number(record.four || 0);
                stats.busted += Number(record.fly || 0);
                
                playerStats.set(name, stats);
            };

            if (data1?.list) data1.list.forEach(processRecord);
            if (data2?.list) data2.list.forEach(processRecord);

            // Map stats to teams
            const teamUpdates: { id: string; total_score: number }[] = [];

            competitors = teams.map((team) => {
                const member1 = playerStats.get(team.member_1_name);
                const member2 = playerStats.get(team.member_2_name);

                const emptyStats = { 
                    totalScore: 0, totalPT: 0, games: 0,
                    first: 0, second: 0, third: 0, fourth: 0, busted: 0
                };

                const stats1 = member1 || emptyStats;
                const stats2 = member2 || emptyStats;

                const totalPT = parseFloat((stats1.totalPT + stats2.totalPT).toFixed(1));
                const totalGames = stats1.games + stats2.games;
                
                // Prepare DB update
                if (totalPT !== team.total_score) {
                    teamUpdates.push({ id: team.id, total_score: totalPT });
                }

                // Helper to calc rates
                const calcRates = (s: typeof emptyStats) => {
                    const g = s.games || 1; // avoid div by zero, returns 0 if games=0 anyway
                    return {
                        winRate: s.games > 0 ? parseFloat(((s.first / g) * 100).toFixed(1)) : 0,
                        avgOrder: s.games > 0 ? parseFloat(((s.first * 1 + s.second * 2 + s.third * 3 + s.fourth * 4) / g).toFixed(2)) : 0,
                        dealInRate: s.games > 0 ? parseFloat(((s.fourth / g) * 100).toFixed(1)) : 0, // using 4th as proxy
                        flyRate: s.games > 0 ? parseFloat(((s.busted / g) * 100).toFixed(1)) : 0
                    };
                };

                const m1Rates = calcRates(stats1);
                const m2Rates = calcRates(stats2);

                // Team Aggregate Rates
                const teamWinRate = totalGames > 0 ? parseFloat((((stats1.first + stats2.first) / totalGames) * 100).toFixed(1)) : 0;
                const teamAvgOrder = totalGames > 0 ? parseFloat((((stats1.first + stats2.first) * 1 + (stats1.second + stats2.second) * 2 + (stats1.third + stats2.third) * 3 + (stats1.fourth + stats2.fourth) * 4) / totalGames).toFixed(2)) : 0;
                const teamDealInRate = totalGames > 0 ? parseFloat((((stats1.fourth + stats2.fourth) / totalGames) * 100).toFixed(1)) : 0;
                const teamFlyRate = totalGames > 0 ? parseFloat((((stats1.busted + stats2.busted) / totalGames) * 100).toFixed(1)) : 0;

                return {
                    id: team.id,
                    rank: 0, // Will sort later
                    name: team.team_name,
                    totalScore: stats1.totalScore + stats2.totalScore, // Not mainly used
                    totalPT: totalPT,
                    gamesPlayed: totalGames,
                    winRate: teamWinRate,
                    top4Rates: [
                        stats1.first + stats2.first,
                        stats1.second + stats2.second,
                        stats1.third + stats2.third,
                        stats1.fourth + stats2.fourth
                    ],
                    avgOrder: teamAvgOrder,
                    dealInRate: teamDealInRate,
                    flyRate: teamFlyRate,
                    extremeScore: 0, // Not available from ext api currently
                    avatar: team.avatar_url || '',
                    trend: 'up', // Always up as requested
                    
                    // Team Specifics
                    member1: team.member_1_name,
                    member2: team.member_2_name,
                    member1Stats: {
                        totalPT: parseFloat(stats1.totalPT.toFixed(1)),
                        gamesPlayed: stats1.games,
                        ...m1Rates
                    },
                    member2Stats: {
                        totalPT: parseFloat(stats2.totalPT.toFixed(1)),
                        gamesPlayed: stats2.games,
                        ...m2Rates
                    },
                    description: team.description
                };
            });

            // Sort by Total PT
            competitors.sort((a, b) => b.totalPT - a.totalPT);
            // Assign ranks
            competitors.forEach((c, i) => c.rank = i + 1);

            // 4. Data Persistence (Async)
            if (teamUpdates.length > 0) {
                // Fire and forget, or handle silently
                updateTeamRankingDB(teamUpdates).catch(e => console.error('Failed to sync team scores to DB:', e));
            }

        } else {
            const parsed = parseMonth(month);
            if (!parsed) {
                setLoading(false);
                return;
            }
            competitors = await fetchRankData(
                parsed.year,
                parsed.month,
                week,
                arena,
                controller.signal
            );
        }

        // Check abort again before setting state
        if (!controller.signal.aborted) {
            setList(competitors);
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          console.log('Request cancelled');
        } else {
          console.error('Failed to fetch rank data:', err);
          if (!controller.signal.aborted) setList([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
      
      return () => controller.abort();
    };

    const cleanup = load();
    return () => {
      cleanup.then(abort => abort && abort());
    };
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

  // Extract year from month string for rule lookup
  const currentYear = useMemo(() => {
    const mm = month.match(/^(\d{4})年/);
    return mm ? parseInt(mm[1]) : new Date().getFullYear();
  }, [month]);

  const settlementDayText = useMemo(() => {
    const rule = getSeasonRule(currentYear);
    // 0=周日, 1=周一... 4=周四
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return `每周${days[rule.settlementDay]}截止统计`;
  }, [currentYear]);

  return (
    <>
      <div className="mb-6">
         {/* ... existing headers ... */}
         <div className="flex items-baseline space-x-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  积分榜
              </h2>
              <span className="text-indigo-600 dark:text-indigo-400 text-sm font-mono font-bold tracking-tight">
                  2025 赛季
              </span>
         </div>
         <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
             当前视图：{category === 'team' ? '全赛区' : arena} • {month} • {week === 'Monthly' ? '全月' : `第 ${week} 周`}
         </p>
         <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
             {category === 'team' && (
                 <span className="block mb-1 text-indigo-500 font-bold">
                     💡 赛区切换不影响团队排名，团队分为全赛区累计。
                 </span>
             )}
             结算规则：{settlementDayText}。
             {(() => {
               const mm = month.match(/^(\d{4})年(\d{1,2})月$/);
               if (mm) {
                 const year = parseInt(mm[1]);
                 const monthNum = parseInt(mm[2]);
                 let dateText = '';
                 
                 if (week === 'Monthly') {
                    const totalWeeks = getWeeksInMonth(year, monthNum);
                    const { startDate } = calculateWeekRange(year, monthNum, 1);
                    const { endDate } = calculateWeekRange(year, monthNum, totalWeeks);
                    
                    const formatDate = (d: Date) => {
                      const y = d.getFullYear();
                      const m = (d.getMonth() + 1).toString().padStart(2, '0');
                      const dd = d.getDate().toString().padStart(2, '0');
                      return `${y}/${m}/${dd}`;
                    };
                    dateText = `${formatDate(startDate)} - ${formatDate(endDate)}`;
                 } else {
                    dateText = getWeekDateRange(year, monthNum, week as number);
                 }
                 
                 return ` 本期时间（北京时间）：${dateText}`;
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
            category === 'team' ? (
                <TeamRankCard
                    key={item.id}
                    data={item}
                    onClick={() => setSelectedCompetitor(item)}
                />
            ) : (
                <RankCard 
                    key={item.id} 
                    data={item} 
                    onClick={() => setSelectedCompetitor(item)}
                    isTeam={false}
                />
            )
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

      {/* Modals */}
      {category === 'team' ? (
          <TeamDetailModal 
            data={selectedCompetitor} 
            onClose={() => setSelectedCompetitor(null)} 
          />
      ) : (
          <DetailModal 
            data={selectedCompetitor} 
            onClose={() => setSelectedCompetitor(null)} 
          />
      )}
    </>
  );
};
