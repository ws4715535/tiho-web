import { ScoreRecord } from '../types/admin';

export interface ExternalMatchRecord {
  idx: number;
  logtime: string;
  acid: number;
  phone1: number;
  phone2: number;
  phone3: number;
  phone4: number;
  point1: number;
  point2: number;
  point3: number;
  point4: number;
  score1: number;
  score2: number;
  score3: number;
  score4: number;
  name1: string;
  name2: string;
  name3: string;
  name4: string;
  defense: number | null;
  createTime: string;
  qd: number | null;
}

export interface ExternalApiResponse {
  code: number;
  message: string;
  timestamp: number;
  data: {
    records: ExternalMatchRecord[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
}

const API_URL = 'https://gsz.rmlinking.com/gszapi/customer/raterecord/page';

export const STORES = {
  UNIVERSITY_TOWN: '127',
  LIJIACUN: '30'
};

export const externalMatchService = {
  async fetchMatches(page: number = 1, pageSize: number = 20, storeId: string = STORES.UNIVERSITY_TOWN): Promise<{
    records: ExternalMatchRecord[];
    total: number;
    current: number;
    pages: number;
  }> {
    try {
      const response = await fetch(`${API_URL}?pageNo=${page}&pageSize=${pageSize}`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6',
          'content-type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ params: { pid: storeId } })
      });

      if (!response.ok) {
        throw new Error(`External API error: ${response.status} ${response.statusText}`);
      }

      const data: ExternalApiResponse = await response.json();
      if (data.code !== 200) {
        throw new Error(`External API returned code ${data.code}: ${data.message}`);
      }

      return {
        records: data.data.records,
        total: data.data.total,
        current: data.data.current,
        pages: data.data.pages
      };
    } catch (error) {
      console.error('Failed to fetch external matches:', error);
      throw error;
    }
  },

  aggregateToScoreRecords(matches: ExternalMatchRecord[]): ScoreRecord[] {
    const playerStats = new Map<string, {
      name: string;
      totalScore: number;
      totalPT: number;
      games: number;
      wins: number;
    }>();

    matches.forEach(match => {
      // Process each of the 4 players
      const players = [
        { name: match.name1, score: match.score1, point: match.point1 },
        { name: match.name2, score: match.score2, point: match.point2 },
        { name: match.name3, score: match.score3, point: match.point3 },
        { name: match.name4, score: match.score4, point: match.point4 },
      ];

      // Determine ranks based on points (descending)
      const sortedPoints = [...players].sort((a, b) => b.point - a.point);
      
      players.forEach(p => {
        if (!playerStats.has(p.name)) {
          playerStats.set(p.name, {
            name: p.name,
            totalScore: 0,
            totalPT: 0,
            games: 0,
            wins: 0
          });
        }
        
        const stat = playerStats.get(p.name)!;
        stat.totalScore += p.score;
        stat.totalPT += p.point;
        stat.games += 1;
        if (p.name === sortedPoints[0].name) {
          stat.wins += 1;
        }
      });
    });

    return Array.from(playerStats.values()).map((stat, index) => ({
      id: `ext-${Date.now()}-${index}`,
      playerName: stat.name,
      totalScore: stat.totalScore,
      totalPT: parseFloat(stat.totalPT.toFixed(1)),
      gamesPlayed: stat.games,
      winRate: parseFloat(((stat.wins / stat.games) * 100).toFixed(1)),
      arena: '大学城',
      month: `${new Date().getFullYear()}年${new Date().getMonth() + 1}月`,
      week: 'Monthly',
      category: 'individual',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }
};
