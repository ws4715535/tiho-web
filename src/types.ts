export type RankPeriod = 'weekly' | 'monthly';
export type RankCategory = 'individual' | 'team';
export type Arena = '大学城' | '李家村';

export interface Member {
  name: string;
  role: 'Captain' | 'Vice' | 'Member';
  avatarStr: string;
  score?: number; // Added score for contribution calculation
  gamesPlayed?: number;
  winRate?: number;
  avgOrder?: number;
  dealInRate?: number;
}

export interface Competitor {
  id: string;
  rank: number;
  name: string;
  teamName?: string;
  avatar?: string;
  members?: Member[];
  totalScore: number;
  totalPT: number;
  avgOrder: number;
  winRate: number;
  dealInRate: number;
  flyRate?: number; // Add flyRate
  feedRate?: number;
  top4Rates: [number, number, number, number];
  gamesPlayed: number;
  trend: 'up' | 'down' | 'stable';
  positionsSeq?: number[];
  pointsSeq?: number[];
  // Team specific fields
  member1?: string;
  member2?: string;
  member1Stats?: {
      totalPT: number;
      gamesPlayed: number;
      winRate: number;
      avgOrder: number;
      dealInRate: number; // Using 4th place rate as proxy if needed, or real deal in rate
      flyRate: number; // Busted rate
  };
  member2Stats?: {
      totalPT: number;
      gamesPlayed: number;
      winRate: number;
      avgOrder: number;
      dealInRate: number;
      flyRate: number;
  };
  description?: string;
  status?: 'active' | 'inactive';
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
