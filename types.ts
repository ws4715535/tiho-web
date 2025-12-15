export type RankPeriod = 'weekly' | 'monthly';
export type RankCategory = 'individual' | 'team';
export type Arena = 'Arena A' | 'Arena B';

export interface Member {
  name: string;
  role: 'Captain' | 'Vice' | 'Member';
  avatarStr: string; // Initials
}

export interface Competitor {
  id: string;
  rank: number;
  name: string;
  teamName?: string; // For individuals
  avatar?: string;
  members?: Member[]; // For teams
  totalScore: number;
  avgOrder: number; // 1.00 - 4.00
  winRate: number; // Percentage
  dealInRate: number; // Percentage
  feedRate?: number; 
  top4Rates: [number, number, number, number]; // 1st, 2nd, 3rd, 4th count or %
  gamesPlayed: number;
  trend: 'up' | 'down' | 'stable';
}

export interface RankData {
  weekly: {
    individual: Competitor[];
    team: Competitor[];
  };
  monthly: {
    individual: Competitor[];
    team: Competitor[];
  };
}