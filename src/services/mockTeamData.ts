import { Competitor } from '../types';
import { AVATAR_URLS } from '../constants/avatarUrls';

const TEAM_NAMES = [
  '天和双子星', '岭上开花', '海底捞月', '国士无双', '九莲宝灯',
  '大三元', '小四喜', '清老头', '字一色', '绿一色',
  '断幺九', '立直一发', '门前清', '平和', '七对子'
];

export const generateMockTeamData = (count: number = 10): Competitor[] => {
  return Array.from({ length: count }).map((_, index) => {
    const teamName = TEAM_NAMES[index % TEAM_NAMES.length];
    // Random avatar for team (using one from the list)
    const avatar = AVATAR_URLS[(index * 3) % AVATAR_URLS.length];
    
    // Mock members
    const member1Name = `队员A${index}`;
    const member2Name = `队员B${index}`;

    const gamesPlayed = Math.floor(Math.random() * 50) + 10;
    const winRate = Math.random() * 40 + 10;
    const rawTotalPT = Math.floor(Math.random() * 1000) - 200;
    const finalTotalPT = parseFloat(rawTotalPT.toFixed(1));
    const avgOrder = 2.5 - (Math.random() * 0.5);

    // Generate member scores with some variance
    let m1Score: number;
    // 30% chance to have divergent scores if total is positive to test "positive total, negative member" case
    if (finalTotalPT > 0 && Math.random() < 0.3) {
        m1Score = parseFloat((finalTotalPT * (1.2 + Math.random() * 0.5)).toFixed(1));
    } else {
        m1Score = parseFloat((finalTotalPT * (Math.random())).toFixed(1));
    }
    const m2Score = parseFloat((finalTotalPT - m1Score).toFixed(1));

    // Generate member stats
    const generateMemberStats = () => ({
      gamesPlayed: Math.floor(gamesPlayed / 2) + Math.floor(Math.random() * 5),
      winRate: parseFloat((winRate + (Math.random() * 10 - 5)).toFixed(1)),
      avgOrder: parseFloat((avgOrder + (Math.random() * 0.4 - 0.2)).toFixed(2)),
      dealInRate: parseFloat((Math.random() * 15 + 5).toFixed(1))
    });

    return {
      id: `team-${index}`,
      rank: index + 1,
      name: teamName, // Team Name stored in name field
      teamName: '双人赛', // Category/Arena context
      avatar: avatar,
      members: [
        { 
          name: member1Name, 
          role: 'Captain' as const, 
          avatarStr: member1Name.charAt(0), 
          score: m1Score,
          ...generateMemberStats()
        },
        { 
          name: member2Name, 
          role: 'Member' as const, 
          avatarStr: member2Name.charAt(0), 
          score: m2Score,
          ...generateMemberStats()
        }
      ],
      totalScore: Math.floor(Math.random() * 100000),
      totalPT: finalTotalPT,
      avgOrder: parseFloat(avgOrder.toFixed(2)),
      winRate: parseFloat(winRate.toFixed(1)),
      dealInRate: parseFloat((Math.random() * 15 + 5).toFixed(1)),
      gamesPlayed: gamesPlayed,
      trend: (Math.random() > 0.5 ? 'up' : 'stable') as 'up' | 'stable',
      top4Rates: [
        Math.floor(gamesPlayed * 0.3),
        Math.floor(gamesPlayed * 0.25),
        Math.floor(gamesPlayed * 0.25),
        Math.floor(gamesPlayed * 0.2)
      ] as [number, number, number, number]
    };
  }).sort((a, b) => b.totalPT - a.totalPT).map((item, idx) => ({ ...item, rank: idx + 1 }));
};

export const fetchMockTeamRankData = async (): Promise<Competitor[]> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockTeamData(15));
    }, 500);
  });
};
