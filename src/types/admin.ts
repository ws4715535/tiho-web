export interface ScoreRecord {
  id: string;
  playerName: string;
  totalScore: number;
  totalPT: number;
  gamesPlayed: number;
  winRate: number;
  arena: '大学城' | '李家村';
  month: string;
  week: string;
  category: 'individual' | 'team';
  createdAt: Date;
  updatedAt: Date;
}
