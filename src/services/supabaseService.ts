import { Raw } from './data';
import supabase from '../lib/supabase/client';


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
      arena: arena,
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
    const { data, error } = await supabase.functions.invoke('update_ranking_week', {
      body: payload
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to upload rank data:', error);
    throw error;
  }
};
