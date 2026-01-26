import { supabase } from '../lib/supabase/client';
import { externalMatchService, STORES } from './externalMatchService';

export interface PairedTeam {
  id: string;
  team_name: string;
  avatar_url: string;
  description: string;
  member_1_name: string;
  member_2_name: string;
  total_score: number;
  created_at?: string;
  status?: 'active' | 'inactive';
}

export interface TeamFormData {
  team_name: string;
  member_1_name: string;
  member_2_name: string;
  avatar_url: string;
  description: string;
  status?: 'active' | 'inactive';
  created_at?: string;
}

// Memory Cache for Team Data
let teamCache: { data: PairedTeam[]; timestamp: number } | null = null;
const TEAM_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * 获取所有战队列表 (带缓存)
 * @returns Promise<PairedTeam[]>
 */
export const fetchAllTeams = async (forceRefresh = false): Promise<PairedTeam[]> => {
  if (!forceRefresh && teamCache && Date.now() - teamCache.timestamp < TEAM_CACHE_TTL) {
    return teamCache.data;
  }

  const { data, error } = await supabase
    .from('paired_teams')
    .select('*')
    .order('created_at', { ascending: true }); // Default sort by created_at ascending (oldest first)

  if (error) {
    throw new Error(error.message);
  }

  const teams = data || [];
  teamCache = {
    data: teams,
    timestamp: Date.now()
  };

  return teams;
};

/**
 * 获取本周起始时间 (周一 00:00:00)
 */
const getStartOfWeek = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

/**
 * 更新数据库中的战队排名数据
 */
export const updateTeamRankingDB = async (teamUpdates: { id: string; total_score: number }[]) => {
  if (!teamUpdates || teamUpdates.length === 0) return;

  // Process in batches if necessary, or use Promise.all
  const updates = teamUpdates.map(async (update) => {
    // Basic retry mechanism
    let retries = 3;
    while (retries > 0) {
      const { error } = await supabase
        .from('paired_teams')
        .update({ total_score: update.total_score })
        .eq('id', update.id);
      
      if (!error) break;
      
      retries--;
      if (retries === 0) {
        console.error(`Failed to update team ${update.id} after 3 attempts:`, error);
      } else {
        await new Promise(r => setTimeout(r, 1000)); // wait 1s before retry
      }
    }
  });

  await Promise.all(updates);
  
  // Invalidate cache after update
  teamCache = null;
};

/**
 * 同步战队积分 (计算本周积分并更新数据库)
 * Deprecated: Replaced by frontend dynamic aggregation logic in RankList for arbitrary dates
 * But keeping it as it was used by Admin
 */
export const syncTeamScores = async () => {
  const startDate = getStartOfWeek();
  const playerScores = new Map<string, number>();

  // 1. Fetch matches from both stores
  const stores = [STORES.UNIVERSITY_TOWN, STORES.LIJIACUN];
  
  for (const storeId of stores) {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const { records, pages } = await externalMatchService.fetchMatches(page, 50, storeId);
        
        if (!records || records.length === 0) {
          hasMore = false;
          break;
        }

        // Process records
        for (const match of records) {
          const matchDate = new Date(match.logtime);
          
          // If match is older than start of week, stop fetching this store
          if (matchDate < startDate) {
            hasMore = false;
            // Don't break here, we need to finish processing the current page's valid records?
            // Actually if records are sorted desc, we can break completely.
            // Assuming sorted desc by logtime.
             break; 
          }

          // Accumulate scores (PT)
          // Note: match.pointX is the PT. match.scoreX is raw score. Usually ranking uses PT.
          // Check if point is null, default to 0
          if (match.name1) playerScores.set(match.name1, (playerScores.get(match.name1) || 0) + (match.point1 || 0));
          if (match.name2) playerScores.set(match.name2, (playerScores.get(match.name2) || 0) + (match.point2 || 0));
          if (match.name3) playerScores.set(match.name3, (playerScores.get(match.name3) || 0) + (match.point3 || 0));
          if (match.name4) playerScores.set(match.name4, (playerScores.get(match.name4) || 0) + (match.point4 || 0));
        }

        // Check if we stopped early in the loop
        if (!hasMore) break;

        if (page >= pages) {
          hasMore = false;
        } else {
          page++;
        }
      } catch (err) {
        console.error(`Error fetching matches for store ${storeId}:`, err);
        hasMore = false; // Stop on error to avoid infinite loops
      }
    }
  }

  // 2. Fetch all teams
  const teams = await fetchAllTeams(true);

  // 3. Update team scores
  const updates = teams.map(async (team) => {
    const score1 = playerScores.get(team.member_1_name) || 0;
    const score2 = playerScores.get(team.member_2_name) || 0;
    const totalScore = parseFloat((score1 + score2).toFixed(1));

    // Only update if changed (optional optimization, but good practice)
    if (team.total_score !== totalScore) {
      const { error } = await supabase
        .from('paired_teams')
        .update({ total_score: totalScore })
        .eq('id', team.id);
      
      if (error) {
        console.error(`Failed to update team ${team.team_name}:`, error);
      }
    }
  });

  await Promise.all(updates);
};

/**
 * 创建新战队
 * @param teamData 战队表单数据
 */
export const createTeam = async (teamData: TeamFormData) => {
  const { error } = await supabase
    .from('paired_teams')
    .insert([teamData]);

  if (error) {
    throw new Error(error.message);
  }
  teamCache = null; // Invalidate cache
};

/**
 * 更新战队信息
 * @param id 战队ID
 * @param teamData 战队表单数据
 */
export const updateTeam = async (id: string, teamData: Partial<TeamFormData>) => {
  const { error } = await supabase
    .from('paired_teams')
    .update(teamData)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
  teamCache = null; // Invalidate cache
};

/**
 * 删除战队
 * @param id 战队ID
 */
export const deleteTeam = async (id: string) => {
  const { error } = await supabase
    .from('paired_teams')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
  teamCache = null; // Invalidate cache
};
