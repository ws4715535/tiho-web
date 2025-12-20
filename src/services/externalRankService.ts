import { Competitor } from '../types';

const RANK_API_URL = 'https://gsz.rmlinking.com/gszapi/producer/monthRank/list';

interface ExternalRankItem {
  name: string;
  rank: number;
  rankName: string | null;
  rate: number;
  count: number;
  point: number | null;
  score: number;
  sortCount: string;
  sort: string;
  avgSort: string;
  avgPoint: number;
  lsScore: string;
  rateName: string;
  upCount: number | null;
  upAvgSort: number | null;
  totalScore: number;
  totalRate: number;
  upRate: number;
  upAvgPosition: number;
  position1: number;
  position2: number;
  position3: number;
  position4: number;
}

interface ExternalRankResponse {
  code: number;
  message: string;
  timestamp: number;
  data: ExternalRankItem[];
}

export const externalRankService = {
  async fetchRank(
    year: number,
    month: number,
    week: number | 'Monthly',
    storeId: string
  ): Promise<Competitor[]> {
    const { startTime, endTime } = this.getDateRange(year, month, week);

    try {
      const response = await fetch(RANK_API_URL, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6',
          'content-type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({
          params: {
            pidList: [parseInt(storeId)],
            startTime,
            endTime,
            count: 1, // As per example
            type: 0   // As per example
          }
        })
      });

      if (!response.ok) {
        throw new Error(`External Rank API error: ${response.status}`);
      }

      const data: ExternalRankResponse = await response.json();
      if (data.code !== 200) {
        throw new Error(`External Rank API returned code ${data.code}: ${data.message}`);
      }

      return this.mapToCompetitors(data.data);

    } catch (error) {
      console.error('Failed to fetch external rank:', error);
      return [];
    }
  },

  getDateRange(year: number, month: number, week: number | 'Monthly'): { startTime: string; endTime: string } {
    if (week === 'Monthly') {
      // Full month
      const start = new Date(year, month - 1, 1, 0, 0, 0);
      const end = new Date(year, month, 0, 23, 59, 59); // Last day of month
      return {
        startTime: this.formatDate(start),
        endTime: this.formatDate(end)
      };
    } else {
      // Weekly logic: Fri-Thu cycles
      // "Beijing time every Friday 0:00 settlement of last week's 7 days".
      // This implies the cycle is Fri 00:00 -> Thu 23:59:59.
      // We align Week 1 to the cycle containing the 1st of the month.
      
      const oneDay = 24 * 60 * 60 * 1000;
      const current = new Date(year, month - 1, 1);
      
      // Find the start of the cycle (Friday) that contains the 1st of the month.
      // Day 0 = Sun, ... 5 = Fri
      // Days since last Friday: (day + 7 - 5) % 7
      const daysSinceFriday = (current.getDay() + 7 - 5) % 7;
      const startOfCycle = new Date(current.getTime() - daysSinceFriday * oneDay);
      startOfCycle.setHours(0, 0, 0, 0);
      
      const weekStart = new Date(startOfCycle.getTime() + (week - 1) * 7 * oneDay);
      const weekEnd = new Date(weekStart.getTime() + 6 * oneDay);
      weekEnd.setHours(23, 59, 59, 999);
      
      return {
        startTime: this.formatDate(weekStart),
        endTime: this.formatDate(weekEnd)
      };
    }
  },

  formatDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  },

  mapToCompetitors(data: ExternalRankItem[]): Competitor[] {
    return data.map(item => ({
      id: item.name, // Use name as ID for now
      rank: item.rank,
      name: item.name,
      // Map 'score' (which seems to be period PT) to totalPT
      // Map 'totalScore' to totalScore
      totalScore: item.totalScore, 
      totalPT: item.score, // Assuming 'score' in API response is the ranking metric (PT)
      avgOrder: parseFloat(item.avgSort),
      winRate: 0, // Cannot calculate period win rate from lifetime positions
      dealInRate: 0,
      feedRate: 0,
      top4Rates: [0, 0, 0, 0], // Cannot calculate period rates
      gamesPlayed: item.count,
      trend: 'stable'
    }));
  }
};
