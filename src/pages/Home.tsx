import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from 'react';
import { Trophy, TrendingUp, Users, ArrowRight, Shield, Activity, MapPin, User, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { preloadMoMoData } from '../services/momoService';
import { supabase } from '../lib/supabase/client';

interface Banner {
  id: string;
  path: string;
  gradient_from: string;
  gradient_to: string;
  label: string;
  title: string;
  desc: string;
  type: string;
}

export const Home = () => {
  const navigate = useNavigate();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      // 1. Try to load from cache
      const CACHE_KEY = 'tiho_banners_cache';
      const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes

      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            setBanners(data);
            setLoadingBanners(false);
            // Optionally still fetch in background to update cache? 
            // For now, trust cache to avoid flicker.
            return; 
          }
        }
      } catch (e) {
        console.error('Cache parse error', e);
      }

      // 2. Fetch from network
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .in('status', ['active', 'upcoming'])
          .order('sort_order', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const mappedBanners = data.map((t: any) => ({
            id: t.id,
            path: `/tournament/${t.id}`,
            gradient_from: t.banner_gradient_from || 'pink-500',
            gradient_to: t.banner_gradient_to || 'rose-600',
            label: t.status === 'active' ? 'NEW SEASON' : 'UPCOMING',
            title: t.title,
            desc: t.intro,
            type: t.type
          }));
          setBanners(mappedBanners);
          
          // Save to cache
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: mappedBanners,
            timestamp: Date.now()
          }));
        } else {
          setBanners([]);
        }
      } catch (err) {
        console.error('Failed to fetch banners:', err);
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchBanners();
  }, []);

  const nextBanner = () => {
    if (banners.length === 0) return;
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    if (banners.length === 0) return;
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleBannerInteraction(nextBanner);
    }
    if (isRightSwipe) {
      handleBannerInteraction(prevBanner);
    }
  };

  useEffect(() => {
    if (banners.length > 0) {
        bannerTimerRef.current = setInterval(nextBanner, 5000);
    }
    return () => {
      if (bannerTimerRef.current) clearInterval(bannerTimerRef.current);
    };
  }, [banners.length]);

  // Reset timer on manual interaction
  const handleBannerInteraction = (action: () => void) => {
    if (bannerTimerRef.current) clearInterval(bannerTimerRef.current);
    action();
    if (banners.length > 0) {
        bannerTimerRef.current = setInterval(nextBanner, 5000);
    }
  };

  useEffect(() => {
    // Preload MoMo data when Home mounts
    preloadMoMoData();
  }, []);

  return (
    <div className="space-y-12 py-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20 animate-pulse"></div>
            <div className="relative w-24 h-24 mx-auto rounded-full shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-black text-4xl tracking-tighter">T</span>
            </div>
        </div>
        
        <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white italic uppercase brand-neon">
                TIHO <span className="text-indigo-600 dark:text-indigo-400"></span>
            </h1>
            <p className="text-sm sm:text-base font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                联赛积分榜
            </p>
        </div>

        <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            致力于打造最专业的日麻竞技环境。数据驱动，公平公正，在这里见证每一位雀士的成长与荣耀。
        </p>

        <div className="pt-4">
            <Button 
                onClick={() => navigate('/ranking')} 
                className="w-full sm:w-auto px-8 py-6 text-lg shadow-lg shadow-indigo-500/25 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-none text-white transition-all hover:scale-105 active:scale-95"
            >
                <Trophy className="mr-2 w-5 h-5" />
                查看联赛积分榜
                <ArrowRight className="ml-2 w-5 h-5 opacity-50" />
            </Button>
        </div>
      </div>

      {/* Match Banners Carousel */}
      {loadingBanners ? (
        <div className="w-full h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse relative overflow-hidden p-6 border border-slate-200 dark:border-slate-700">
             {/* Gradient hint */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-slate-200 dark:bg-slate-700 blur-2xl"></div>
            
            <div className="relative z-10 flex items-center justify-between h-full">
                <div className="space-y-4 w-2/3">
                    {/* Badge Skeleton */}
                    <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    {/* Title Skeleton */}
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                    {/* Desc Skeleton */}
                    <div className="space-y-2">
                        <div className="h-4 w-full max-w-xs bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                </div>
                {/* Icon Skeleton */}
                <div className="hidden sm:block h-16 w-16 bg-slate-200 dark:bg-slate-700 rounded-full mr-8"></div>
            </div>
        </div>
      ) : banners.length > 0 ? (
      <div className="relative group/carousel">
        <div 
          className="overflow-hidden rounded-2xl shadow-lg"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out" 
            style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
          >
            {banners.map((banner) => (
              <div 
                key={banner.id}
                onClick={() => navigate(banner.path)}
                style={{ background: `linear-gradient(to right, ${banner.gradient_from.startsWith('#') || banner.gradient_from.startsWith('rgb') ? banner.gradient_from : `var(--color-${banner.gradient_from}, ${banner.gradient_from})`}, ${banner.gradient_to.startsWith('#') || banner.gradient_to.startsWith('rgb') ? banner.gradient_to : `var(--color-${banner.gradient_to}, ${banner.gradient_to})`})` }}
                className={`w-full flex-shrink-0 relative overflow-hidden p-6 text-white cursor-pointer transform transition-all active:scale-[0.99] ${!banner.gradient_from.startsWith('#') && !banner.gradient_from.startsWith('rgb') ? `bg-gradient-to-r from-${banner.gradient_from} to-${banner.gradient_to}` : ''}`}
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-black/10 blur-xl"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md mb-3">
                      <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-white"></span>
                      {banner.label}
                    </div>
                    <h2 className="text-2xl font-black italic tracking-tight mb-1">{banner.title}</h2>
                    <p className="text-white/90 text-sm font-medium max-w-xs leading-relaxed">
                      {banner.desc}
                    </p>
                  </div>
                  <div className="hidden sm:block transform group-hover/carousel:scale-110 transition-transform duration-300">
                     {banner.type === 'team' ? <Users className="h-16 w-16 text-white/90 drop-shadow-md" /> : <User className="h-16 w-16 text-white/90 drop-shadow-md" />}
                  </div>
                </div>
                
                <div className="mt-4 flex items-center text-sm font-bold text-white/90">
                  了解赛事详情 <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        <button 
          onClick={(e) => { e.stopPropagation(); handleBannerInteraction(prevBanner); }}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-opacity z-20 opacity-50 hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleBannerInteraction(nextBanner); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-opacity z-20 opacity-50 hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {banners.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentBannerIndex === idx ? 'bg-white w-4' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>
      ) : (
        <div className="w-full h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-sm border border-slate-200 dark:border-slate-700">
           暂无进行中的赛事
        </div>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => navigate('/community')}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer sm:col-span-2 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
            
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">活跃社群</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                        汇聚各路高手，定期举办交流赛与教学活动，共同进步。
                    </p>
                    <div className="inline-flex items-center text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                        加入联赛积分 <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                </div>
            </div>
        </div>

        {/* 备案要求暂时隐藏
        <div 
          onClick={() => navigate('/momo')}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer relative overflow-hidden"
        >
             <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-bl-full -mr-6 -mt-6 pointer-events-none"></div>
            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Match. Chat. Meet.</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                不仅是竞技，更是交友。心动功能❤️帮你发现身边和全国的雀友，开启你的心动对局。
            </p>
        </div>
        */}

        <div 
          onClick={() => navigate('/data-analysis')}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">专业数据分析</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                记录每一场对局，提供详细的五维雷达图与进阶数据，助你科学提升雀力。
            </p>
        </div>

        <div 
          onClick={() => navigate('/fair-play')}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">公平竞技环境</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                完善的裁判系统与赛事规则，确保每一场比赛的公平性，让技术说话。
            </p>
        </div>

        <div 
          onClick={() => navigate('/league-system')}
          className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer"
        >
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">联赛体系</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                年度积分制联赛，争夺季度与年度总冠军，赢取丰厚奖励与荣誉。
            </p>
        </div>
      </div>

      {/* Footer / Info */}
      <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8 text-left">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">李家村万达店</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              西安市碑林区李家村万达广场2栋1单元1405室
            </p>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-900 dark:text-white">长安大学城万科店</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              西安市长安区万科广场D座1430室
            </p>
          </div>
        </div>

        <a 
          href="https://beian.miit.gov.cn/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-slate-400 dark:text-slate-600 font-mono hover:text-slate-500 dark:hover:text-slate-500 transition-colors"
        >
          陕ICP备2026001694号-2
        </a>
      </div>
    </div>
  );
};
