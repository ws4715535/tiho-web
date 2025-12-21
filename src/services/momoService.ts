import { fetchRankData } from './supabaseService';
import { Competitor } from '../types';

const MOMO_CACHE_KEY = 'tiho_momo_cache_v1';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

interface CacheData {
  timestamp: number;
  data: Competitor[];
}

export const preloadMoMoData = async () => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // Check if cache is valid
    const cached = localStorage.getItem(MOMO_CACHE_KEY);
    if (cached) {
      const parsed: CacheData = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
        console.log('MoMo data already cached and valid');
        return;
      }
    }

    console.log('Preloading MoMo data...');
    // Fetch both stores
    const [universityData, lijiacunData] = await Promise.all([
      fetchRankData(year, month, 'Monthly', '大学城'),
      fetchRankData(year, month, 'Monthly', '李家村')
    ]);

    // Merge and deduplicate by name (if user plays in both stores, we might want to merge stats? 
    // For simplicity, just concat. If same name exists, it might appear twice which is fine for "random selection")
    // Actually, MoMo is about matching "people". If same person, maybe just keep one?
    // Let's concat for now.
    const allData = [...universityData, ...lijiacunData];

    if (allData.length > 0) {
      const cacheData: CacheData = {
        timestamp: Date.now(),
        data: allData
      };
      localStorage.setItem(MOMO_CACHE_KEY, JSON.stringify(cacheData));
      console.log(`Cached ${allData.length} profiles for MoMo`);
    }
  } catch (error) {
    console.error('Failed to preload MoMo data:', error);
  }
};

export const getMoMoProfiles = async (count: number = 20): Promise<Competitor[]> => {
  try {
    // Try to get from cache first
    const cached = localStorage.getItem(MOMO_CACHE_KEY);
    let pool: Competitor[] = [];

    if (cached) {
      const parsed: CacheData = JSON.parse(cached);
      // Even if expired, we might use it as fallback? 
      // User said "if success then cache... if no cache then pull".
      // Let's check expiry.
      if (Date.now() - parsed.timestamp < CACHE_EXPIRY) {
        pool = parsed.data;
      }
    }

    // If no cache or empty, fetch fresh
    if (pool.length === 0) {
      console.log('Cache missing or expired, fetching fresh data for MoMo');
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      
      const [universityData, lijiacunData] = await Promise.all([
        fetchRankData(year, month, 'Monthly', '大学城'),
        fetchRankData(year, month, 'Monthly', '李家村')
      ]);
      
      pool = [...universityData, ...lijiacunData];
      
      // Cache it
      if (pool.length > 0) {
        const cacheData: CacheData = {
          timestamp: Date.now(),
          data: pool
        };
        localStorage.setItem(MOMO_CACHE_KEY, JSON.stringify(cacheData));
      }
    }

    if (pool.length === 0) return [];

    // Randomly select 'count' items
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Failed to get MoMo profiles:', error);
    return [];
  }
};
