import { Raw } from './data';
import supabase from '../lib/supabase/client';
import { Competitor } from '../types';

// Configuration for database tables and functions
// Best practice: Use environment variables to control this (e.g. import.meta.env.VITE_TABLE_PREFIX)
// Using import.meta.env.VITE_ENVIRONMENT to switch between production and development tables automatically
const viteEnvironment = import.meta.env.VITE_ENVIRONMENT;

const DB_CONFIG = {
  RANK_TABLE: `player_rank_weekly_${viteEnvironment}`,
  UPDATE_FUNC: `update_ranking_week_${viteEnvironment}`
};

interface RankUploadPayload {
  data: {
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
  }[];
}

interface RankResponseItem {
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
}

export const uploadRankData = async (
  year: number,
  month: number,
  week: number,
  arena: string,
  records: Raw[]
) => {
  // Map Raw data to Payload format
  const payload: RankUploadPayload = {
    data: records.map(record => ({
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
      point: record.pt
    }))
  };

  try {
    const { data, error } = await supabase.functions.invoke(DB_CONFIG.UPDATE_FUNC, {
      body: payload
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to upload rank data:', error);
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
