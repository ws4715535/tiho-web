import { supabase } from '../lib/supabase/client';

export interface PairedTeam {
  id: string;
  team_name: string;
  avatar_url: string;
  description: string;
  member_1_name: string;
  member_2_name: string;
  total_score: number;
}

export interface TeamFormData {
  team_name: string;
  member_1_name: string;
  member_2_name: string;
  avatar_url: string;
  description: string;
}

/**
 * 获取所有战队列表
 * @returns Promise<PairedTeam[]>
 */
export const fetchAllTeams = async (): Promise<PairedTeam[]> => {
  const { data, error } = await supabase
    .from('paired_teams')
    .select('*')
    .order('total_score', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
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
};
