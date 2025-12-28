import { supabase } from '../lib/supabase/client';

export interface CommunitySettings {
  id: string;
  contact_name?: string; // 联系人姓名
  contact_wechat: string;
  contact_phone: string;
  group_qr_code: string;
  updated_at?: string;
}

/**
 * 上传群二维码图片
 * @param file 
 * @returns publicUrl
 */
export const uploadCommunityQR = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `group_qr_${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('community_settings')
    .upload(fileName, file);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage
    .from('community_settings')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

/**
 * 获取社区设置（单例）
 */
export const fetchCommunitySettings = async (): Promise<CommunitySettings | null> => {
  const { data, error } = await supabase
    .from('community_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    // If no rows found, might return null or error P0002
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data;
};

/**
 * 更新社区设置
 * @param settings Partial<CommunitySettings>
 */
export const updateCommunitySettings = async (settings: Partial<CommunitySettings>) => {
  // First check if a row exists
  const existing = await fetchCommunitySettings();
  
  if (existing) {
    const { error } = await supabase
      .from('community_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);
      
    if (error) throw new Error(error.message);
  } else {
    // Create new if somehow missing
    const { error } = await supabase
      .from('community_settings')
      .insert([settings]);
      
    if (error) throw new Error(error.message);
  }
};
