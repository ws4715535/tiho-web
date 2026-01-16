import React from 'react';
import { Competitor } from '../types';
import { X, Users } from 'lucide-react';

interface TeamDetailModalProps {
  data: Competitor | null;
  onClose: () => void;
}

export const TeamDetailModal: React.FC<TeamDetailModalProps> = ({ data, onClose }) => {
  if (!data || !data.member1 || !data.member2) return null;
  
  const m1Name = data.member1;
  const m2Name = data.member2;
  const m1StatsData = data.member1Stats;
  const m2StatsData = data.member2Stats;

  // Mock individual data derived from team data for demo purposes (Radar chart still mocked for now as we don't have detailed trait stats)
  // In real app, these should come from API
  const generateMemberStats = (seed: number) => {
    return {
      top2: Math.min(100, 30 + (seed % 40)),
      momentum: Math.min(100, 20 + (seed % 60)),
      efficiency: Math.min(100, 40 + (seed % 50)),
      ceiling: Math.min(100, 50 + (seed % 40)),
      resilience: Math.min(100, 30 + (seed % 50))
    };
  };

  const m1Radar = generateMemberStats(data.totalScore);
  const m2Radar = generateMemberStats(data.totalScore + 123);
  
  const m1Score = m1StatsData?.totalPT ?? 0;
  const m2Score = m2StatsData?.totalPT ?? 0;
  
  const getContribution = (score: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((score / total) * 100);
  };

  const m1Contribution = getContribution(m1Score, data.totalPT);
  const m2Contribution = getContribution(m2Score, data.totalPT);

  const getScoreColor = (val: number) => {
    if (val > 0) return 'text-red-500 dark:text-red-400';
    if (val < 0) return 'text-green-500 dark:text-green-400';
    return 'text-slate-500 dark:text-slate-400';
  };
  
  // Radar Chart Logic
  const labels = ['稳定度', '连胜能力', '得点效率', '爆发力', '抗压性'];
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 20;
  
  const angle = (i: number) => (Math.PI * 2 * i) / labels.length - Math.PI / 2;
  const toPoint = (val: number, i: number) => {
    const rr = (val / 100) * r;
    const a = angle(i);
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  };

  const m1Points = [m1Radar.top2, m1Radar.momentum, m1Radar.efficiency, m1Radar.ceiling, m1Radar.resilience]
    .map((v, i) => toPoint(v, i)).map(p => p.join(',')).join(' ');
    
  const m2Points = [m2Radar.top2, m2Radar.momentum, m2Radar.efficiency, m2Radar.ceiling, m2Radar.resilience]
    .map((v, i) => toPoint(v, i)).map(p => p.join(',')).join(' ');

  const rings = [0.25, 0.5, 0.75, 1];
  const axis = labels.map((lab, i) => {
    const [ax, ay] = toPoint(100, i);
    const tx = cx + ((ax - cx) * (r + 18)) / r;
    const ty = cy + ((ay - cy) * (r + 18)) / r;
    return { ax, ay, tx, ty, lab };
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 dark:bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#131720] border-t sm:border border-slate-200 dark:border-slate-700 sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/40 rounded-full text-slate-900 dark:text-white backdrop-blur-md transition-colors shadow-sm"
        >
            <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 relative overflow-hidden shrink-0 text-white">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Users className="w-40 h-40" />
            </div>

            <div className="relative z-10">
                <div className="inline-block px-2 py-1 mb-3 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-widest border border-white/20">
                    当前排名 #{data.rank}
                </div>
                
                <div className="flex items-center gap-4">
                    {data.avatar ? (
                        <img src={data.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-lg" />
                    ) : (
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                            {data.name.charAt(0)}
                        </div>
                    )}
                    <div>
                        <h2 className="text-3xl font-black tracking-tight leading-none mb-1">{data.name}</h2>
                        <div className="flex items-center gap-2 text-indigo-100 text-sm font-medium">
                            <span>双人赛战队</span>
                            <span className="w-1 h-1 rounded-full bg-white/50"></span>
                            <span>{data.gamesPlayed} 场对局</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900/50" style={{ overscrollBehaviorY: 'contain' }}>
            
            {/* Team Summary */}
            <div className="p-6 grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center col-span-2">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">总积分</div>
                    <div className={`text-4xl font-black font-mono ${data.totalPT > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        {data.totalPT > 0 ? '+' : ''}{parseFloat(data.totalPT.toFixed(1))}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">总对局数</div>
                    <div className="text-xl font-bold text-slate-800 dark:text-white">
                        {data.gamesPlayed}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">一位率</div>
                    <div className="text-xl font-bold text-slate-800 dark:text-white">
                        {data.winRate}%
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">平均顺位</div>
                    <div className="text-xl font-bold text-slate-800 dark:text-white">
                        {data.avgOrder}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">被飞率</div>
                    <div className="text-xl font-bold text-slate-800 dark:text-white">
                        {data.flyRate ?? 0}%
                    </div>
                </div>
            </div>

            {/* Radar Chart Section */}
            <div className="px-6 pb-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">能力分布对比</span>
                        <div className="flex gap-3 text-[10px] font-bold">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                                <span className="text-slate-600 dark:text-slate-300">{m1Name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                                <span className="text-slate-600 dark:text-slate-300">{m2Name}</span>
                            </div>
                        </div>
                    </div>

                    <div className="radar relative mx-auto" style={{ width: size, height: size }}>
                        <svg width={size} height={size} className="absolute left-0 top-0 overflow-visible">
                            <g className="grid opacity-30 dark:opacity-20">
                                {rings.map((k, idx) => (
                                    <circle key={idx} cx={cx} cy={cy} r={r * k} fill="none" stroke="currentColor" className="text-slate-400" />
                                ))}
                                {axis.map((a, idx) => (
                                    <line key={idx} x1={cx} y1={cy} x2={a.ax} y2={a.ay} stroke="currentColor" className="text-slate-400" />
                                ))}
                            </g>
                            {/* Member 1 Area */}
                            <polygon points={m1Points} className="fill-cyan-500/20 stroke-cyan-500 stroke-2" />
                            {/* Member 2 Area */}
                            <polygon points={m2Points} className="fill-pink-500/20 stroke-pink-500 stroke-2" />
                        </svg>
                        
                        {axis.map((a, i) => (
                            <div key={labels[i]} className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 dark:text-slate-400 pointer-events-none"
                                style={{ left: a.tx, top: a.ty }}>
                                {labels[i]}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Members Detail */}
            <div className="px-6 pb-8 space-y-3">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold block mb-1">战队成员</span>
                
                {/* Member 1 Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-sm font-bold text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                                {m1Name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white text-sm">{m1Name}</div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                    贡献度: <span className={getScoreColor(m1Contribution)}>{m1Contribution}%</span>
                                    <span className={`font-mono ${getScoreColor(m1Score)}`}>({m1Score > 0 ? '+' : ''}{parseFloat(m1Score.toFixed(1))})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 border-t border-slate-100 dark:border-slate-700 pt-3">
                        <div className="text-center">
                            <div className="text-[10px] text-slate-400 mb-0.5">对局</div>
                            <div className="font-mono font-bold text-slate-700 dark:text-slate-200 text-xs">{m1StatsData?.gamesPlayed ?? '-'}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-slate-400 mb-0.5">一位率</div>
                            <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-xs">{m1StatsData?.winRate ?? '-'}%</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-slate-400 mb-0.5">均顺</div>
                            <div className="font-mono font-bold text-slate-700 dark:text-slate-200 text-xs">{m1StatsData?.avgOrder ?? '-'}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-slate-400 mb-0.5">被飞率</div>
                            <div className="font-mono font-bold text-slate-700 dark:text-slate-200 text-xs">{m1StatsData?.flyRate ?? '-'}%</div>
                        </div>
                    </div>
                </div>

                {/* Member 2 Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-sm font-bold text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
                                {m2Name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white text-sm">{m2Name}</div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                    贡献度: <span className={getScoreColor(m2Contribution)}>{m2Contribution}%</span>
                                    <span className={`font-mono ${getScoreColor(m2Score)}`}>({m2Score > 0 ? '+' : ''}{parseFloat(m2Score.toFixed(1))})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 border-t border-slate-100 dark:border-slate-700 pt-3">
                        <div className="text-center">
                            <div className="text-[10px] text-slate-400 mb-0.5">对局</div>
                            <div className="font-mono font-bold text-slate-700 dark:text-slate-200 text-xs">{m2StatsData?.gamesPlayed ?? '-'}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-slate-400 mb-0.5">一位率</div>
                            <div className="font-mono font-bold text-pink-600 dark:text-pink-400 text-xs">{m2StatsData?.winRate ?? '-'}%</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-slate-400 mb-0.5">均顺</div>
                            <div className="font-mono font-bold text-slate-700 dark:text-slate-200 text-xs">{m2StatsData?.avgOrder ?? '-'}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[10px] text-slate-400 mb-0.5">被飞率</div>
                            <div className="font-mono font-bold text-slate-700 dark:text-slate-200 text-xs">{m2StatsData?.flyRate ?? '-'}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
