import { RankData, Competitor, Arena, RankCategory } from "../types";

type Raw = {
  name: string;
  games: number;
  first: number;
  second: number;
  third: number;
  fourth: number;
  bifei: number;
  total: number;
  pt: number;
};

const RAW_DEC_W2: Raw[] = [
  { name: '小五郎', games: 16, first: 4, second: 7, third: 3, fourth: 2, bifei: 0, total: 485700, pt: 135.7 },
  { name: '私权分析与建构', games: 8, first: 4, second: 2, third: 1, fourth: 1, bifei: 0, total: 230600, pt: 120.6 },
  { name: '豚豚', games: 12, first: 4, second: 5, third: 1, fourth: 2, bifei: 0, total: 343600, pt: 113.6 },
  { name: 'Misakaa', games: 5, first: 2, second: 2, third: 0, fourth: 1, bifei: 0, total: 189300, pt: 104.3 },
  { name: 'placebo', games: 4, first: 2, second: 1, third: 0, fourth: 1, bifei: 0, total: 131000, pt: 81 },
  { name: '柳越', games: 3, first: 2, second: 1, third: 0, fourth: 0, bifei: 0, total: 103400, pt: 58.4 },
  { name: '竹依轻风', games: 5, first: 2, second: 0, third: 3, fourth: 0, bifei: 0, total: 137000, pt: 42 },
  { name: '月夜繁星', games: 4, first: 1, second: 1, third: 1, fourth: 1, bifei: 0, total: 136700, pt: 36.7 },
  { name: '猪柳蛋汉堡', games: 9, first: 1, second: 5, third: 3, fourth: 0, bifei: 0, total: 259900, pt: 34.9 },
  { name: '恶调', games: 5, first: 2, second: 1, third: 1, fourth: 1, bifei: 1, total: 122700, pt: 27.7 },
  { name: '肖小', games: 3, first: 1, second: 0, third: 1, fourth: 1, bifei: 0, total: 78600, pt: 3.6 },
  { name: '椰不群', games: 3, first: 1, second: 0, third: 1, fourth: 1, bifei: 0, total: 77100, pt: 2.1 },
  { name: '小钉子儿', games: 5, first: 2, second: 0, third: 1, fourth: 2, bifei: 1, total: 110000, pt: -5 },
  { name: 'Orin', games: 2, first: 0, second: 1, third: 1, fourth: 0, bifei: 0, total: 53700, pt: -6.3 },
  { name: '沙漠孤狼001', games: 1, first: 0, second: 0, third: 1, fourth: 0, bifei: 0, total: 16500, pt: -18.5 },
  { name: '且行', games: 4, first: 1, second: 0, third: 2, fourth: 1, bifei: 1, total: 76400, pt: -33.6 },
  { name: '邮寄碎片', games: 3, first: 0, second: 0, third: 2, fourth: 1, bifei: 0, total: 69500, pt: -45.5 },
  { name: '小卡比兽', games: 5, first: 1, second: 0, third: 1, fourth: 3, bifei: 1, total: 81200, pt: -83.8 },
  { name: '玄武湖冲浪手', games: 4, first: 0, second: 1, third: 1, fourth: 2, bifei: 1, total: 60400, pt: -89.6 },
  { name: '朱哥', games: 7, first: 1, second: 1, third: 1, fourth: 4, bifei: 2, total: 109200, pt: -125.8 },
  { name: 'fishone', games: 9, first: 0, second: 1, third: 2, fourth: 6, bifei: 2, total: 97700, pt: -267.3 },
];

// 2025年12月 第1周 大学城（Arena A）数据
const RAW_DEC_W1: Raw[] = [
  { name: '肖小', games: 18, first: 6, second: 5, third: 5, fourth: 2, bifei: 1, total: 529600, pt: 169.6 },
  { name: '衣锦鲤', games: 6, first: 2, second: 3, third: 1, fourth: 1, bifei: 0, total: 191100, pt: 91.1 },
  { name: '不完备定理', games: 6, first: 2, second: 2, third: 1, fourth: 1, bifei: 1, total: 179500, pt: 59.5 },
  { name: '小五郎', games: 12, first: 4, second: 2, third: 3, fourth: 3, bifei: 1, total: 317500, pt: 47.5 },
  { name: 'Orin', games: 6, first: 2, second: 2, third: 0, fourth: 2, bifei: 0, total: 163900, pt: 33.9 },
  { name: '我是战斗贼', games: 2, first: 1, second: 0, third: 0, fourth: 1, bifei: 0, total: 57700, pt: 27.7 },
  { name: '右手第一张', games: 6, first: 2, second: 2, third: 1, fourth: 0, bifei: 2, total: 154900, pt: 24.9 },
  { name: '摸鱼玩家', games: 2, first: 0, second: 1, third: 1, fourth: 0, bifei: 0, total: 44900, pt: -15.1 },
  { name: '小钉子儿', games: 6, first: 1, second: 0, third: 3, fourth: 2, bifei: 2, total: 138800, pt: -51.2 },
  { name: '鸡打狗摸', games: 14, first: 3, second: 3, third: 5, fourth: 3, bifei: 2, total: 290600, pt: -79.4 },
  { name: '朱哥', games: 6, first: 1, second: 0, third: 3, fourth: 2, bifei: 3, total: 117100, pt: -82.9 },
  { name: '椰不群', games: 12, first: 0, second: 4, third: 2, fourth: 6, bifei: 2, total: 214400, pt: -225.6 },
];

function toCompetitors(rows: Raw[]): Competitor[] {
  const list = rows.map((r, i) => {
    const avgOrder = Number(((r.first + 2 * r.second + 3 * r.third + 4 * r.fourth) / r.games).toFixed(2));
    const winRate = Number(((r.first / r.games) * 100).toFixed(1));
    const dealInRate = Number(((r.fourth / r.games) * 100).toFixed(1));
    return {
      id: `comp-ind-${i}`,
      rank: i + 1,
      name: r.name,
      teamName: '大学城',
      totalScore: r.total,
      totalPT: Number(r.pt.toFixed(1)),
      avgOrder,
      winRate,
      dealInRate,
      gamesPlayed: r.games,
      trend: 'stable' as const,
      top4Rates: [r.first, r.second, r.third, r.fourth],
    };
  });
  return list
    .sort((a, b) => b.totalPT - a.totalPT)
    .map((c, idx) => ({
      ...c,
      rank: idx + 1,
      top4Rates: [c.top4Rates[0], c.top4Rates[1], c.top4Rates[2], c.top4Rates[3]] as [number, number, number, number],
    }));
}

export const MOCK_DATA: RankData = {
  weekly: {
    individual: toCompetitors(RAW_DEC_W2),
    team: [],
  },
  monthly: {
    individual: [],
    team: [],
  },
};

function key(month: string, week: number | 'Monthly', arena: Arena, category: RankCategory) {
  return `${month}|${week}|${arena}|${category}`;
}

const DATASETS: Record<string, Competitor[]> = {
  [key('2025年12月', 2, 'Arena A', 'individual')]: toCompetitors(RAW_DEC_W2),
  [key('2025年12月', 1, 'Arena A', 'individual')]: toCompetitors(RAW_DEC_W1),
};

const RAWSETS: Record<string, Raw[]> = {
  [key('2025年12月', 2, 'Arena A', 'individual')]: RAW_DEC_W2,
  [key('2025年12月', 1, 'Arena A', 'individual')]: RAW_DEC_W1,
};

function aggregateMonthlyRaw(month: string, arena: Arena, category: RankCategory): Raw[] {
  const rows: Raw[] = [];
  const prefix = `${month}|`;
  const suffix = `|${arena}|${category}`;
  Object.keys(RAWSETS).forEach(k => {
    if (k.startsWith(prefix) && k.endsWith(suffix)) {
      rows.push(...RAWSETS[k]);
    }
  });
  const agg = new Map<string, Raw>();
  for (const r of rows) {
    const prev = agg.get(r.name);
    if (!prev) {
      agg.set(r.name, { ...r });
    } else {
      agg.set(r.name, {
        name: r.name,
        games: prev.games + r.games,
        first: prev.first + r.first,
        second: prev.second + r.second,
        third: prev.third + r.third,
        fourth: prev.fourth + r.fourth,
        bifei: prev.bifei + r.bifei,
        total: prev.total + r.total,
        pt: Number((prev.pt + r.pt).toFixed(1)),
      });
    }
  }
  return Array.from(agg.values());
}

export function getRankData(month: string, week: number | 'Monthly', arena: Arena, category: RankCategory): Competitor[] {
  if (week === 'Monthly') {
    const raw = aggregateMonthlyRaw(month, arena, category);
    return toCompetitors(raw);
  }
  return DATASETS[key(month, week, arena, category)] ?? [];
}
