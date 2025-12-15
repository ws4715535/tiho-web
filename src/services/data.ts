import { RankData, Competitor, Member } from "../types";

const TEAM_NAMES = ['风林火山', '樱花缭乱', '七武士', '碎瓦团', '龙之眼'];

const generateMembers = (teamName: string): Member[] => {
  const count = 4;
  return Array.from({ length: count }).map((_, i) => ({
    name: `${teamName.substring(0, 2)} ${String.fromCharCode(65 + i)}`,
    role: i === 0 ? 'Captain' : i === 1 ? 'Vice' : 'Member',
    avatarStr: String.fromCharCode(65 + i)
  }));
};

const generateCompetitors = (count: number, isTeam: boolean): Competitor[] => {
  return Array.from({ length: count }).map((_, i) => {
    const rank = i + 1;
    // Score correlates roughly with rank but with some randomness
    const baseScore = 500 - (i * 40); 
    const score = Math.floor(baseScore + (Math.random() * 60 - 30));
    
    // Avg order correlates with rank
    const baseOrder = 2.00 + (i * 0.1);
    const avgOrder = Math.min(4.00, Math.max(1.00, Number((baseOrder + (Math.random() * 0.4 - 0.2)).toFixed(2))));

    const winRate = Math.max(10, 35 - (i * 1.5) + (Math.random() * 5));
    const dealInRate = Math.min(25, 10 + (i * 0.8) + (Math.random() * 3));

    const trend: 'up' | 'down' | 'stable' = Math.random() > 0.7 ? 'up' : Math.random() > 0.4 ? 'down' : 'stable';
    
    const top4Rates: [number, number, number, number] = [
        Math.floor(Math.random() * 10), 
        Math.floor(Math.random() * 10), 
        Math.floor(Math.random() * 10), 
        Math.floor(Math.random() * 5)
    ];

    const teamName = isTeam ? TEAM_NAMES[i % TEAM_NAMES.length] : undefined;

    return {
      id: `comp-${isTeam ? 'team' : 'ind'}-${i}`,
      rank,
      name: isTeam ? teamName! : `选手_${String.fromCharCode(65 + i)}${Math.floor(Math.random() * 99)}`,
      teamName: isTeam ? undefined : TEAM_NAMES[Math.floor(Math.random() * TEAM_NAMES.length)],
      members: isTeam ? generateMembers(teamName!) : undefined,
      totalScore: Number(score.toFixed(1)),
      avgOrder,
      winRate: Number(winRate.toFixed(1)),
      dealInRate: Number(dealInRate.toFixed(1)),
      gamesPlayed: Math.floor(Math.random() * 20) + 5,
      trend,
      top4Rates
    };
  }).sort((a, b) => b.totalScore - a.totalScore).map((c, i) => ({ ...c, rank: i + 1 }));
};

// We will just regenerate this on load. In a real app this is API data.
export const MOCK_DATA: RankData = {
  weekly: {
    individual: generateCompetitors(15, false),
    team: generateCompetitors(5, true),
  },
  monthly: {
    individual: generateCompetitors(15, false),
    team: generateCompetitors(5, true),
  },
};