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
  feedRate?: number;
  top4Rates: [number, number, number, number];
  gamesPlayed: number;
  trend: 'up' | 'down' | 'stable';
  positionsSeq?: number[];
  pointsSeq?: number[];
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
