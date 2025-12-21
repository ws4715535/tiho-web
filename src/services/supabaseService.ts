import { Raw } from './data';
import supabase from '../lib/supabase/client';
import { Competitor } from '../types';
import { getStoreConfig } from '../constants/stores';
import { getWeekDateRange, calculateWeekRange } from '../lib/utils';

// Configuration for database tables and functions
// Best practice: Use environment variables to control this (e.g. import.meta.env.VITE_TABLE_PREFIX)
// Using import.meta.env.VITE_ENVIRONMENT to switch between production and development tables automatically
const viteEnvironment = import.meta.env.VITE_ENVIRONMENT;

const DB_CONFIG = {
  RANK_TABLE: `player_rank_weekly_${viteEnvironment}`,
  // UPDATE_FUNC: `update_ranking_week_${viteEnvironment}` // Deprecated: Now using direct SQL upsert
};

export interface RankResponseItem {
  id: number;
  arena: string;
  match_year: number;
  match_month: number;
  match_week: number;
  nickname: string;
  game_count: number;
  position1: number;
  position2: number;
  position3: number;
  position4: number;
  busted: number;
  total_score: number;
  point: number;
  created_at: string;
  max_point?: number;
  avatar_url?: string;
}

export const fetchRawRankData = async (
  year: number,
  month: number,
  week: number | 'All',
  arena: string
): Promise<RankResponseItem[]> => {
  try {
    let query = supabase
      .from(DB_CONFIG.RANK_TABLE)
      .select("*")
      .eq("arena", arena)
      .eq("match_year", year)
      .eq("match_month", month);

    if (week !== 'All') {
      query = query.eq("match_week", week);
    }

    const { data, error } = await query.order('point', { ascending: false });

    if (error) throw error;
    return (data as RankResponseItem[]) || [];
  } catch (error) {
    console.error("fetchRawRankData error:", error);
    throw error;
  }
};

export const deleteRankDataItem = async (id: number) => {
  try {
    const { error } = await supabase
      .from(DB_CONFIG.RANK_TABLE)
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error("deleteRankDataItem error:", error);
    throw error;
  }
};

export const updateRankDataItem = async (id: number, updates: Partial<RankResponseItem>) => {
  try {
    const { error } = await supabase
      .from(DB_CONFIG.RANK_TABLE)
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error("updateRankDataItem error:", error);
    throw error;
  }
};

export const uploadRankData = async (
  year: number,
  month: number,
  week: number,
  arena: string,
  records: Raw[]
) => {
  // Map Raw data to Payload format
  const upsertData = records.map(record => ({
    arena: arena, // Mapping: 大学城 -> East, 李家村 -> West
    match_year: year,
    match_month: month,
    match_week: week,
    nickname: record.name,
    game_count: record.games,
    position1: record.first,
    position2: record.second,
    position3: record.third,
    position4: record.fourth,
    busted: record.bifei,
    total_score: record.total,
    point: record.pt,
    avatar_url: record.avatar
  }));

  try {
    const { data, error } = await supabase
      .from(DB_CONFIG.RANK_TABLE)
      .upsert(upsertData, {
        onConflict: 'arena,match_year,match_month,match_week,nickname'
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to upload rank data:', error);
    throw error;
  }
};

export const fetchRandomRankData = async (
  year: number,
  month: number,
  limit: number = 10
): Promise<RankResponseItem[]> => {
  try {
    const { data, error } = await supabase
      .from(DB_CONFIG.RANK_TABLE)
      .select("*")
      .eq("match_year", year)
      .eq("match_month", month);

    if (error) throw error;
    
    // Randomly select items
    const items = (data as RankResponseItem[]) || [];
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error("fetchRandomRankData error:", error);
    throw error;
  }
};

export const fetchExternalRankData = async (dateRange: string, storeId: string = "127", limit: number = 200) => {
  try {
    const { data, error } = await supabase.functions.invoke('hook_session', {
      body: {
        date: dateRange,
        storeId: storeId,
        limit: limit,
        page: "1"
      }
    });

    if (error) throw error;
    console.log("查询成功:", data);
    return data;
  } catch (error) {
    console.error("fetchExternalRankData error:", error);
    throw error;
  }
};

export const fetchRankDataFromDB = async (
  year: number,
  month: number,
  week: number | 'Monthly',
  arena: string
): Promise<Competitor[]> => {
  try {
    let query = supabase
      .from(DB_CONFIG.RANK_TABLE)
      .select("*")
      .eq("arena", arena)
      .eq("match_year", year)
      .eq("match_month", month);

    if (week !== 'Monthly') {
      query = query.eq("match_week", week);
    }

    const { data, error } = await query;

    if (error) {
      console.error("fetchRankData error:", error);
      throw error;
    }
    
    // Transform API response to Competitor[]
    let items = (data as RankResponseItem[]) || [];

    // Aggregate if Monthly
    if (week === 'Monthly') {
      const aggMap = new Map<string, RankResponseItem>();
      items.forEach(item => {
        if (!aggMap.has(item.nickname)) {
          // Clone item to avoid mutating original data if needed, though here we just process
          aggMap.set(item.nickname, { ...item });
        } else {
          const existing = aggMap.get(item.nickname)!;
          existing.game_count += item.game_count;
          existing.position1 += item.position1;
          existing.position2 += item.position2;
          existing.position3 += item.position3;
          existing.position4 += item.position4;
          existing.busted += item.busted;
          existing.total_score += item.total_score;
          existing.point += item.point;
        }
      });
      items = Array.from(aggMap.values());
    }
    
    // Sort by point descending
    items.sort((a, b) => b.point - a.point);

    return items.map((item, index) => {
      const avgOrder = item.game_count > 0 
        ? (item.position1 * 1 + item.position2 * 2 + item.position3 * 3 + item.position4 * 4) / item.game_count 
        : 0;
      
      const winRate = item.game_count > 0 
        ? (item.position1 / item.game_count) * 100 
        : 0;
      
      // Using 4th place rate as dealInRate proxy as per previous logic (or just 0 if strictly deal-in)
      // In data.ts: dealInRate = Number(((r.fourth / r.games) * 100).toFixed(1));
      const dealInRate = item.game_count > 0 
        ? (item.position4 / item.game_count) * 100 
        : 0;

      return {
        id: `sb-${item.id || index}`,
        rank: index + 1,
        name: item.nickname,
        avatar: item.avatar_url,
        teamName: arena,
        totalScore: item.total_score,
        totalPT: parseFloat(item.point.toFixed(1)),
        avgOrder: parseFloat(avgOrder.toFixed(2)),
        winRate: parseFloat(winRate.toFixed(1)),
        dealInRate: parseFloat(dealInRate.toFixed(1)),
        gamesPlayed: item.game_count,
        trend: 'stable',
        top4Rates: [item.position1, item.position2, item.position3, item.position4]
      };
    });

  } catch (error) {
    console.error('Failed to fetch rank data:', error);
    throw error;
  }
};

export const fetchRankData = async (
  year: number,
  month: number,
  week: number | 'Monthly',
  arena: string
): Promise<Competitor[]> => {
  try {
    // 1. Get Store Config
    const storeConfig = getStoreConfig(arena);
    
    // 2. Get Date Range
    let dateRange = '';
    if (week === 'Monthly') {
        const { startDate } = calculateWeekRange(year, month, 1);
        const { endDate } = calculateWeekRange(year, month, 4);
        
        const formatDate = (d: Date) => {
          const y = d.getFullYear();
          const m = (d.getMonth() + 1).toString().padStart(2, '0');
          const dd = d.getDate().toString().padStart(2, '0');
          return `${y}-${m}-${dd}`;
        };
        dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else {
        dateRange = getWeekDateRange(year, month, week).replace(/\//g, '-');
    }

    // 3. Call External API
    // Note: fetchExternalRankData logs the result, so we don't need to log here again unless error
    const data = await fetchExternalRankData(dateRange, storeConfig.id, storeConfig.limit);

    if (!data || !data.success || !Array.isArray(data.list)) {
      console.warn('External rank data format invalid or empty', data);
      return [];
    }

    // 4. Transform and Sort
    let items = data.list.map((item: any, index: number) => {
        const games = Number(item.total || 0);
        const first = Number(item.one || 0);
        const second = Number(item.two || 0);
        const third = Number(item.three || 0);
        const fourth = Number(item.four || 0);
        const pt = Number(item.point || 0);

        const avgOrder = games > 0
          ? (first * 1 + second * 2 + third * 3 + fourth * 4) / games
          : 0;

        const winRate = games > 0 ? (first / games) * 100 : 0;
        
        // Using 4th place as deal-in proxy for now as per previous logic
        const dealInRate = games > 0 ? (fourth / games) * 100 : 0;

        return {
          id: `ext-${item.id || index}`,
          // Rank will be assigned after sort
          rank: 0, 
          name: item.username || '',
          avatar: item.avatarUrl,
          teamName: arena,
          totalScore: Number(item.score || 0),
          totalPT: pt,
          avgOrder: parseFloat(avgOrder.toFixed(2)),
          winRate: parseFloat(winRate.toFixed(1)),
          dealInRate: parseFloat(dealInRate.toFixed(1)),
          gamesPlayed: games,
          trend: 'stable' as const,
          top4Rates: [first, second, third, fourth]
        };
    });

    // Sort by PT descending
    items.sort((a: any, b: any) => b.totalPT - a.totalPT);

    // Assign Rank
    items = items.map((item: any, index: number) => ({
      ...item,
      rank: index + 1
    }));

    return items;

  } catch (error) {
    console.error('Failed to fetch rank data from external source:', error);
    return [];
  }
};
