import React, { useEffect, useState } from 'react';
import { Competitor } from '../types';
import { X, Trophy, AlertTriangle, Target, Activity, Users, Star, Info } from 'lucide-react';
import { cn } from '../lib/utils';

interface DetailModalProps {
  data: Competitor | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ data, onClose }) => {
  if (!data) return null;
  const [radarInfoOpen, setRadarInfoOpen] = useState(false);
  const [distInfoOpen, setDistInfoOpen] = useState(false);
  const [fiveInfoOpen, setFiveInfoOpen] = useState(false);

  const roleMap: Record<string, string> = {
      'Captain': '队长',
      'Vice': '副队长',
      'Member': '队员'
  };

  const trendMap: Record<string, string> = {
      'up': '上升',
      'down': '下降',
      'stable': '持平'
  };


  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = (document.body.style as any).touchAction;
    document.body.style.overflow = 'hidden';
    (document.body.style as any).touchAction = 'none';
    return () => {
      document.body.style.overflow = prevOverflow;
      (document.body.style as any).touchAction = prevTouchAction || '';
    };
  }, []);

  const g = Math.max(1, data.gamesPlayed);
  const firstRate = (data.top4Rates[0] / g) * 100;
  const fourthRate = (data.top4Rates[3] / g) * 100;
  const top2Rate = ((data.top4Rates[0] + data.top4Rates[1]) / g) * 100;
  const offense = Math.min(5, (firstRate / 25) * 5);
  const defense = Math.max(0, Math.min(5, 5 - (fourthRate / 25) * 5));
  const efficiency = Math.max(0, Math.min(5, ((4 - data.avgOrder) / 3) * 5));
  const consistency = Math.min(5, (top2Rate / 60) * 5);
  const momentum = Math.max(0, Math.min(5, ((data.totalPT + 200) / 400) * 5));

  const starRow = (value: number) => {
    const filled = Math.round(value);
    return (
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={i < filled ? "w-3 h-3 text-yellow-500" : "w-3 h-3 text-slate-300 dark:text-slate-600"} fill={i < filled ? "currentColor" : "none"} />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#131720] border-t sm:border border-slate-200 dark:border-slate-700 sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]">
        
        {/* Floating Close Button - Placed absolutely relative to the Modal Card, high Z-index */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/40 rounded-full text-slate-900 dark:text-white backdrop-blur-md transition-colors shadow-sm"
        >
            <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-100 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 p-6 relative overflow-hidden shrink-0">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 pointer-events-none">
                <Trophy className="w-32 h-32 text-slate-900 dark:text-white" />
            </div>

            <div className="relative z-10 pr-10">
                <div className="inline-block px-2 py-1 mb-2 bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 rounded text-[10px] text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-widest">
                    当前排名 #{data.rank}
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{data.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">{data.teamName || '独立选手'}</p>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar" style={{ overscrollBehaviorY: 'contain' }}>
            
            {/* Main Score Big */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                    <span className="text-xs text-slate-500 uppercase tracking-widest">总积分</span>
                    <div className="text-4xl font-mono font-bold text-slate-900 dark:text-white">
                        {data.totalScore}
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">总PT</span>
                      <div className={cn("text-2xl font-mono font-bold", data.totalPT > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400')}>
                        {data.totalPT > 0 ? '+' : ''}{data.totalPT}
                      </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs text-slate-500 uppercase tracking-widest">对局数</span>
                    <div className="text-2xl font-mono font-bold text-slate-800 dark:text-white">
                        {data.gamesPlayed}
                    </div>
                </div>
            </div>

            {/* Grid Stats */}
            <div className="p-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2 text-yellow-600 dark:text-yellow-400">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">一位率</span>
                    </div>
                    <div className="text-xl font-mono text-slate-900 dark:text-white">{data.winRate}%</div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 dark:bg-yellow-400 h-full" style={{ width: `${data.winRate}%` }} />
                    </div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2 text-indigo-600 dark:text-indigo-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">连对率</span>
                    </div>
                    {(() => {
                      if (data.positionsSeq && data.positionsSeq.length > 1) {
                        const seq = data.positionsSeq;
                        let denom = 0;
                        let numer = 0;
                        for (let i = 1; i < seq.length; i++) {
                          if (seq[i - 1] === 1) {
                            denom++;
                            if (seq[i] === 1) numer++;
                          }
                        }
                        const rate = Number(((numer / Math.max(1, denom)) * 100).toFixed(1));
                        return (
                          <>
                            <div className="text-xl font-mono text-slate-900 dark:text-white">{rate}%</div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 dark:bg-indigo-400 h-full" style={{ width: `${rate}%` }} />
                            </div>
                          </>
                        );
                      } else {
                        const first = data.top4Rates[0] || 0;
                        const denom = Math.max(0, first - 1);
                        const p = data.winRate / 100;
                        const numerEst = Math.round(denom * p);
                        const rate = Number(((numerEst / Math.max(1, denom)) * 100).toFixed(1));
                        return (
                          <>
                            <div className="text-xl font-mono text-slate-900 dark:text-white">{isNaN(rate) ? 0 : rate}%</div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 mt-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 dark:bg-indigo-400 h-full" style={{ width: `${isNaN(rate) ? 0 : rate}%` }} />
                            </div>
                          </>
                        );
                      }
                    })()}
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2 text-blue-500 dark:text-blue-400">
                        <Target className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">平均顺位</span>
                    </div>
                    <div className="text-xl font-mono text-slate-900 dark:text-white">{data.avgOrder}</div>
                </div>

                <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center space-x-2 mb-2 text-purple-500 dark:text-purple-400">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">近期走势</span>
                    </div>
                    <div className="text-xl font-mono text-slate-900 dark:text-white capitalize">{trendMap[data.trend] || data.trend}</div>
                </div>
            </div>

            <div className="px-6 pt-2" onClick={() => { setRadarInfoOpen(false); }}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase tracking-widest block mb-3 mt-4">成绩表现雷达</span>
                <button onClick={(e) => { e.stopPropagation(); setRadarInfoOpen(v => !v); }} className="p-1 rounded text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white" aria-label="雷达图说明">
                  <Info className="w-4 h-4" />
                </button>
              </div>
              {(() => {
                const g = Math.max(1, data.gamesPlayed);
                const top2 = Math.max(0, Math.min(100, (((data.top4Rates[0] + data.top4Rates[1]) / g) * 100)));
                let momentumPct = 0;
                if (data.positionsSeq && data.positionsSeq.length > 1) {
                  const seq = data.positionsSeq;
                  let denom = 0;
                  let numer = 0;
                  for (let i = 1; i < seq.length; i++) {
                    if (seq[i - 1] === 1) {
                      denom++;
                      if (seq[i] === 1) numer++;
                    }
                  }
                  momentumPct = Math.max(0, Math.min(100, (numer / Math.max(1, denom)) * 100));
                } else {
                  const first = data.top4Rates[0] || 0;
                  const denom = Math.max(0, first - 1);
                  const numerEst = denom * (data.winRate / 100);
                  momentumPct = Math.max(0, Math.min(100, (numerEst / Math.max(1, denom)) * 100));
                }
                const avgPts = data.totalPT / g;
                const efficiencyPct = Math.max(0, Math.min(100, ((avgPts + 200) / 400) * 100));
                let ceilingPct = 0;
                if (data.pointsSeq && data.pointsSeq.length) {
                  const maxPt = Math.max(...data.pointsSeq);
                  ceilingPct = Math.max(0, Math.min(100, ((maxPt + 200) / 400) * 100));
                } else {
                  ceilingPct = Math.max(0, Math.min(100, efficiencyPct));
                }
                let resiliencePct = 0;
                if (data.positionsSeq && data.positionsSeq.length > 1) {
                  const seq = data.positionsSeq;
                  let denom = 0;
                  let numer = 0;
                  for (let i = 1; i < seq.length; i++) {
                    if (seq[i - 1] === 4) {
                      denom++;
                      if (seq[i] === 1 || seq[i] === 2) numer++;
                    }
                  }
                  resiliencePct = Math.max(0, Math.min(100, (numer / Math.max(1, denom)) * 100));
                } else {
                  const denom = data.top4Rates[3] || 0;
                  const numerEst = denom * (top2 / 100);
                  resiliencePct = Math.max(0, Math.min(100, (numerEst / Math.max(1, denom)) * 100));
                }
                const values = [top2, momentumPct, efficiencyPct, ceilingPct, resiliencePct];
                const labels = ['稳定度', '连胜能力', '得点效率', '爆发力', '抗压性'];
                const size = 180;
                const cx = size / 2;
                const cy = size / 2;
                const r = size / 2 - 18;
                const angle = (i: number) => (Math.PI * 2 * i) / values.length - Math.PI / 2;
                const toPoint = (val: number, i: number) => {
                  const rr = (val / 100) * r;
                  const a = angle(i);
                  return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
                };
                const points = values.map((v, i) => toPoint(v, i)).map(p => p.join(',')).join(' ');
                const rings = [0.25, 0.5, 0.75, 1];
                const axis = labels.map((lab, i) => {
                  const [ax, ay] = toPoint(100, i);
                  const tx = cx + ((ax - cx) * (r + 16)) / r;
                  const ty = cy + ((ay - cy) * (r + 16)) / r;
                  return { ax, ay, tx, ty, lab };
                });
                return (
                  <div className="radar relative mx-auto" style={{ width: size, height: size }}>
                    <svg width={size} height={size} className="absolute left-0 top-0">
                      <g className="grid">
                        {rings.map((k, idx) => (
                          <circle key={idx} cx={cx} cy={cy} r={r * k} fill="none" />
                        ))}
                        {axis.map((a, idx) => (
                          <line key={idx} x1={cx} y1={cy} x2={a.ax} y2={a.ay} />
                        ))}
                      </g>
                      <polygon points={points} className="shape" />
                    </svg>
                    {axis.map((a, i) => (
                      <div key={labels[i]} className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 whitespace-nowrap max-w-[96px] bg-transparent pointer-events-none"
                        style={{ left: a.tx, top: a.ty }}>
                        <span className="text-[10px] text-slate-600 dark:text-slate-300">{labels[i]}</span>
                        <span className="text-[12px] font-mono font-bold text-slate-900 dark:text-white">{Math.round(values[i])}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
              
            </div>

            {/* Five-Star Ratings */}
            <div className="px-6 pt-4" onClick={() => setFiveInfoOpen(false)}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 uppercase tracking-widest block mb-3 mt-4">综合评估</span>
                <button onClick={(e) => { e.stopPropagation(); setFiveInfoOpen(v => !v); }} className="p-1 rounded text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white" aria-label="综合评估说明">
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 mb-1">进攻</div>
                  {starRow(offense)}
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 mb-1">防守</div>
                  {starRow(defense)}
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 mb-1">效率</div>
                  {starRow(efficiency)}
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 mb-1">稳定</div>
                  {starRow(consistency)}
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] text-slate-600 dark:text-slate-300 mb-1">势头</div>
                  {starRow(momentum)}
                </div>
              </div>
              {fiveInfoOpen && (
                <div onClick={(e) => e.stopPropagation()} className="mt-2 w-[min(320px,90%)] p-3 text-xs rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow text-slate-600 dark:text-slate-300">
                  综合评估以五项星级展示进攻、防守、效率、稳定和势头，来源于一位率、四位率、平均顺位、Top2率与积分表现，便于快速判断选手风格与状态。
                </div>
              )}
            </div>

            {/* Place Distribution */}
            <div className="px-6 pb-6" onClick={() => { setDistInfoOpen(false); }}>
              <div className="flex items-center justify-start">
                <span className="text-xs text-slate-500 uppercase tracking-widest block mb-3 mt-4">顺位分布</span>
              </div>
                <div className="flex h-8 rounded-lg overflow-hidden font-mono text-[10px] font-bold text-slate-900 dark:text-black text-center leading-8 border border-slate-200 dark:border-transparent">
                    <div style={{ flex: data.top4Rates[0] || 1 }} className="bg-yellow-400">一位</div>
                    <div style={{ flex: data.top4Rates[1] || 1 }} className="bg-slate-300">二位</div>
                    <div style={{ flex: data.top4Rates[2] || 1 }} className="bg-amber-600 text-white">三位</div>
                    <div style={{ flex: data.top4Rates[3] || 1 }} className="bg-slate-700 text-white">四位</div>
                </div>
                {distInfoOpen && (
                  <div onClick={(e) => e.stopPropagation()} className="mt-2 p-3 text-xs rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow text-slate-600 dark:text-slate-300">
                    展示一至四位的数量比例，来源于当前筛选周期的对局数据。
                  </div>
                )}
            </div>

            {/* Fixed Place Counts Bottom */}
            <div className="px-6 pb-8">
              <div className="mt-2 grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="text-[10px] text-slate-500">一位</div>
                  <div className="text-sm font-mono font-bold text-yellow-600 dark:text-yellow-400">{data.top4Rates[0]}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500">二位</div>
                  <div className="text-sm font-mono font-bold text-slate-600 dark:text-slate-300">{data.top4Rates[1]}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500">三位</div>
                  <div className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400">{data.top4Rates[2]}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-500">四位</div>
                  <div className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200">{data.top4Rates[3]}</div>
                </div>
              </div>
            </div>

            {/* Roster (Team Only) */}
            {data.members && (
                <div className="px-6 pb-8">
                    <div className="flex items-center space-x-2 mb-3 text-slate-400">
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">现役成员</span>
                    </div>
                    <div className="space-y-2">
                        {data.members.map((member, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300">
                                        {member.avatarStr}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{member.name}</span>
                                </div>
                                <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded", 
                                    member.role === 'Captain' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : 
                                    member.role === 'Vice' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                    'bg-slate-100 dark:bg-slate-700 text-slate-500'
                                )}>
                                    {roleMap[member.role] || member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        {radarInfoOpen && (
          <div className="absolute inset-0 z-[150]">
            <div className="absolute inset-0 bg-slate-900/50 dark:bg-black/70" onClick={() => setRadarInfoOpen(false)} />
            <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
              <div className="w-[92%] max-w-[720px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 uppercase tracking-widest">radarSummary</span>
                  <button onClick={() => setRadarInfoOpen(false)} className="p-1 rounded text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                  <div>
                    <div className="font-semibold mb-1">稳定度（Consistency）</div>
                    <div>指标：Top 2 率</div>
                    <div>说明：在所有对局中，取得前二名的比例，反映整体成绩的稳定性。</div>
                    <div>计算公式：Top 2 率 =（一位次数 + 二位次数）÷ 总对局数</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">连胜能力（Momentum）</div>
                    <div>指标：连对率（连续 1 位率）</div>
                    <div>说明：在上一局取得 1 位后，下一局仍保持 1 位的概率，用于衡量状态延续与连胜能力。</div>
                    <div>计算公式：连对率 = 连续两局均为 1 位的次数 ÷ 上一局为 1 位的次数</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">得点效率（Scoring Efficiency）</div>
                    <div>指标：平均得点</div>
                    <div>说明：每局对局的平均得分表现，体现整体得点效率与长期收益能力。</div>
                    <div>计算公式：平均得点 = 总得点 ÷ 总对局数</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">爆发力（Ceiling）</div>
                    <div>指标：最高单局得点（或前 10% 单局得点）</div>
                    <div>说明：在单局中取得高分的能力，反映是否具备通过关键一局拉开分差的爆发潜力。</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">抗压性（Resilience）</div>
                    <div>指标：四位后反弹率</div>
                    <div>说明：在上一局取得四位后，下一局回到前二名的比例，用于衡量逆境调整与心理韧性。</div>
                    <div>计算公式：四位后反弹率 = 上一局四位且下一局 Top 2 的次数 ÷ 上一局四位的次数</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
