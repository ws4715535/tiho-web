import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Heart, RefreshCw, Trophy, Star, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchRandomRankData, RankResponseItem } from '../services/supabaseService';
import { Button } from '../components/ui/Button';
import { AVATAR_URLS } from '../constants/avatarUrls';

interface Profile {
  id: number;
  name: string;
  avatarStr: string;
  avatarUrl: string;
  tags: string[];
  desc: string;
  rank?: string;
  style?: string;
  color: string;
  winRate: number;
  avgOrder: number;
  avgPoint: number;
  bustedRate: number;
}

// Helper to transform API data to Profile
const transformDataToProfiles = (data: RankResponseItem[]): Profile[] => {
  return data.map((item, index) => {
    const winRate = item.game_count > 0 
      ? parseFloat(((item.position1 / item.game_count) * 100).toFixed(1)) 
      : 0;
    
    const avgOrder = item.game_count > 0 
      ? parseFloat(((item.position1 * 1 + item.position2 * 2 + item.position3 * 3 + item.position4 * 4) / item.game_count).toFixed(2)) 
      : 0;

    const avgPoint = item.game_count > 0 
      ? parseFloat(((item.total_score) / item.game_count).toFixed(0)) 
      : 0;

    const bustedRate = item.game_count > 0 
      ? parseFloat(((item.busted / item.game_count) * 100).toFixed(1)) 
      : 0;

    // Determine Rank based on points (rough estimation)
    let rank = 'B';
    if (item.point > 100) rank = 'SS';
    else if (item.point > 50) rank = 'S';
    else if (item.point > 20) rank = 'A+';
    else if (item.point > 0) rank = 'A';

    // Determine Style based on stats
    let style = '平衡流';
    if (winRate > 30) style = '进攻型';
    else if (item.busted === 0 && item.game_count > 5) style = '铁壁流';
    else if (item.position4 / item.game_count < 0.2) style = '防守型';
    else if (item.position1 > item.position2 && item.position1 > item.position3) style = '运势流';

    // Generate color based on ID or Name hash
    const colors = [
      'from-pink-500 to-rose-500',
      'from-blue-500 to-indigo-500',
      'from-amber-500 to-orange-500',
      'from-slate-700 to-slate-900',
      'from-yellow-400 to-amber-500',
      'from-red-600 to-rose-600',
      'from-emerald-500 to-teal-600',
      'from-purple-500 to-violet-600',
      'from-cyan-600 to-blue-700',
      'from-indigo-600 to-violet-600'
    ];
    const colorIndex = (item.id || index) % colors.length;

    // Mock tags and desc for now, or derive
    const possibleTags = ['进攻型', '防守铁壁', '运势流', '读牌', '速攻', '门清', '染手', '绝境反击', '数据流', '役满'];
    const rawTags = [
      style, 
      possibleTags[(item.id + 1) % possibleTags.length],
      possibleTags[(item.id + 2) % possibleTags.length]
    ];
    // Deduplicate tags to avoid key collision
    const tags = Array.from(new Set(rawTags));

    const descs = [
      '只有被选中的人才能看见岭上开花。',
      '麻将不是运气游戏，是概率的艺术。',
      '天下武功，唯快不破。',
      '无声的立直才是最致命的。',
      '发牌员是我亲戚。',
      '比赛不到最后一刻决不放弃。',
      '副露？那是不存在的。',
      '哪怕是只做一种颜色，也要做到极致。',
      '只要我不点炮，我就不会输。',
      '朴实无华，且枯燥。'
    ];
    const desc = descs[(item.id) % descs.length] || '享受每一局对局。';

    // Assign random avatar from the list based on ID
    const avatarUrl = AVATAR_URLS[(item.id || index) % AVATAR_URLS.length];

    return {
      id: item.id,
      name: item.nickname,
      avatarStr: item.nickname.charAt(0),
      avatarUrl,
      tags,
      desc,
      rank,
      style,
      color: colors[colorIndex],
      winRate,
      avgOrder,
      avgPoint,
      bustedRate
    };
  });
};

export const MoMo = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Use a Ref to store exit direction for each card ID
  const exitDirections = React.useRef<Record<number, number>>({});
  const initialized = React.useRef(false);

  const loadProfiles = async () => {
    if (initialized.current && profiles.length > 0) return; // Prevent reload if already has data (optional, but good for navigation back/forth if state preserved, though here state is local)
    // Actually, we want to prevent double fetch on mount.
    
    setLoading(true);
    try {
      // Hardcode current month for now, or use date utils
      const now = new Date();
      const rawData = await fetchRandomRankData(now.getFullYear(), 12, 10); // Using Dec 2025 as per app context, or use dynamic
      // Actually app context seems to use 2025-12. Let's use 2025, 12 as default or current.
      // Let's stick to 2025, 12 for demo consistency with RankList.
      if (rawData.length > 0) {
        setProfiles(transformDataToProfiles(rawData));
      } else {
         // Fallback if no data found? Or empty state handles it.
         setProfiles([]);
      }
    } catch (error) {
      console.error('Failed to load MoMo profiles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadProfiles();
    }
  }, []);

  const removeProfile = (id: number) => {
    setProfiles((current) => current.filter((profile) => profile.id !== id));
  };

  const handleSwipe = (direction: string, id: number) => {
    exitDirections.current[id] = direction === 'left' ? -200 : 200;
    removeProfile(id);
  };

  const reset = () => {
    // Reset initialized so we can load again if needed, or just call loadProfiles directly (which we do).
    // Actually loadProfiles checks initialized.current && profiles.length > 0.
    // So we should probably bypass that check or reset initialized.
    // But better to just set profiles to empty and call fetch logic directly.
    setProfiles([]);
    setLoading(true);
    // Force reload logic
    const now = new Date();
    fetchRandomRankData(now.getFullYear(), 12, 10).then(rawData => {
        if (rawData.length > 0) {
            setProfiles(transformDataToProfiles(rawData));
        } else {
            setProfiles([]);
        }
    }).finally(() => setLoading(false));

    exitDirections.current = {};
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center overflow-hidden">
      {/* Background Elements - Fixed container to prevent overflow issues affecting main layout */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Close Button */}
      <button 
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/40 dark:bg-black/20 dark:hover:bg-black/40 rounded-full text-slate-900 dark:text-white backdrop-blur-md transition-colors shadow-sm"
      >
          <X className="w-6 h-6" />
      </button>

      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
           <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-indigo-100 dark:border-slate-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <Heart className="absolute inset-0 m-auto w-8 h-8 text-indigo-500 animate-pulse" fill="currentColor" />
           </div>
           <p className="text-sm text-slate-500 dark:text-slate-400 font-mono tracking-widest animate-pulse">正在寻找有缘人...</p>
        </div>
      ) : profiles.length > 0 ? (
        <div className="relative w-full max-w-[320px] aspect-[3/4.5]">
          <AnimatePresence>
            {profiles.map((profile, index) => (
              <Card
                key={profile.id}
                profile={profile}
                onSwipe={(dir) => handleSwipe(dir, profile.id)}
                isTop={index === profiles.length - 1}
                exitDirections={exitDirections}
              />
            ))}
          </AnimatePresence>
          
          {/* Controls */}
          <div className="absolute -bottom-20 left-0 right-0 flex justify-center items-center gap-6 z-10">
            <div className="flex flex-col items-center gap-1">
              <button 
                className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:scale-110 transition-all border border-slate-200 dark:border-slate-700"
                onClick={() => {
                  if (profiles.length > 0) handleSwipe('left', profiles[profiles.length - 1].id);
                }}
              >
                <X className="w-6 h-6" />
              </button>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">拉</span>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <button 
                className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:scale-110 transition-all border border-slate-200 dark:border-slate-700"
                onClick={() => {
                   if (profiles.length > 0) handleSwipe('right', profiles[profiles.length - 1].id);
                }}
              >
                <Heart className="w-6 h-6 fill-current" />
              </button>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">夯</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6 animate-in zoom-in duration-500">
          <div className="relative mx-auto w-24 h-24">
             <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full animate-ping opacity-75"></div>
             <div className="relative bg-white dark:bg-slate-800 rounded-full p-6 shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center h-full w-full">
                <Sparkles className="w-10 h-10 text-indigo-500" />
             </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">今日推荐已阅完</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              既然这么有缘，不如去看看排行榜上的高手们？
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              重新再来
            </Button>
            <Button onClick={() => navigate('/ranking')}>
              <Trophy className="w-4 h-4 mr-2" />
              查看榜单
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

interface CardProps {
  profile: Profile;
  onSwipe: (direction: string) => void;
  isTop: boolean;
  exitDirections: React.MutableRefObject<Record<number, number>>;
}

const cardVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: (custom: { exitDirections: React.MutableRefObject<Record<number, number>>, id: number }) => {
    const dir = custom.exitDirections.current[custom.id];
    return {
      x: dir !== undefined ? dir : 200,
      opacity: 0,
      transition: { duration: 0.2 }
    };
  }
};

const Card: React.FC<CardProps> = ({ profile, onSwipe, isTop, exitDirections }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  // Like/Nope Overlay Opacity
  const likeOpacity = useTransform(x, [20, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      onSwipe('right');
    } else if (info.offset.x < -100) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      custom={{ exitDirections, id: profile.id }}
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        zIndex: isTop ? 10 : 0,
        scale: isTop ? 1 : 0.95,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="absolute inset-0 w-full h-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-grab active:cursor-grabbing select-none"
    >
      {/* Gradient Background */}
      {profile.avatarUrl ? (
        <div className="absolute inset-0 h-3/5 overflow-hidden">
            <img 
                src={profile.avatarUrl} 
                alt="" 
                className="w-full h-full object-cover blur-md opacity-60 scale-110" 
            />
             <div className={`absolute inset-0 bg-gradient-to-br ${profile.color} opacity-40 mix-blend-overlay`}></div>
        </div>
      ) : (
        <div className={`absolute inset-0 h-3/5 bg-gradient-to-br ${profile.color} opacity-90`}></div>
      )}
      
      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col">
          {/* Avatar Area */}
          <div className="flex-1 flex items-center justify-center relative">
             <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-2xl overflow-hidden relative">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-black text-white">{profile.avatarStr}</span>
                )}
             </div>
             <div className="absolute top-4 right-4 px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white font-mono font-bold text-xs">
                RANK {profile.rank}
             </div>
          </div>

          {/* Info Area */}
          <div className="bg-white dark:bg-slate-900 h-2/5 p-5 relative rounded-t-3xl -mt-6">
             <div className="absolute -top-12 left-6">
                <div className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                    <span className="font-bold text-slate-800 dark:text-white text-xs">{profile.style}</span>
                </div>
             </div>
             
             <div className="mt-1 h-full flex flex-col">
                 <div className="mb-3">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-0.5">{profile.name}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic line-clamp-2">"{profile.desc}"</p>
                 </div>

                 <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-1 text-center border border-slate-100 dark:border-slate-700">
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">一位率</div>
                        <div className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">{profile.winRate}%</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-1 text-center border border-slate-100 dark:border-slate-700">
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">平均顺位</div>
                        <div className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">{profile.avgOrder}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-1 text-center border border-slate-100 dark:border-slate-700">
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">平均打点</div>
                        <div className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400">{profile.avgPoint}</div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-1 text-center border border-slate-100 dark:border-slate-700">
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">被飞率</div>
                        <div className="text-sm font-mono font-bold text-rose-600 dark:text-rose-400">{profile.bustedRate}%</div>
                    </div>
                 </div>
                 
                 <div className="flex flex-wrap gap-1.5 mt-auto">
                    {profile.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                            #{tag}
                        </span>
                    ))}
                 </div>
             </div>
          </div>
      </div>

      {/* Swipe Indicators */}
      {isTop && (
        <>
            <motion.div 
                style={{ opacity: likeOpacity }}
                className="absolute top-8 left-8 border-4 border-emerald-500 text-emerald-500 rounded-lg px-4 py-2 text-4xl font-black uppercase tracking-widest transform -rotate-12 z-20 pointer-events-none"
            >
                夯
            </motion.div>
            <motion.div 
                style={{ opacity: nopeOpacity }}
                className="absolute top-8 right-8 border-4 border-rose-500 text-rose-500 rounded-lg px-4 py-2 text-4xl font-black uppercase tracking-widest transform rotate-12 z-20 pointer-events-none"
            >
                拉
            </motion.div>
        </>
      )}
    </motion.div>
  );
};
