import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Trophy, TrendingUp, Users, ArrowRight, Shield, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import tihoLogo from '../assets/tiho_logo.png';
import { preloadMoMoData } from '../services/momoService';

export const Home = () => {
  const navigate = useNavigate();

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
            <img src={tihoLogo} alt="Tiho Club" className="relative w-24 h-24 mx-auto rounded-full shadow-xl" />
        </div>
        
        <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white italic uppercase brand-neon">
                TIHO <span className="text-indigo-600 dark:text-indigo-400">CLUB</span>
            </h1>
            <p className="text-sm sm:text-base font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                天和雀庄 · 竞技麻雀俱乐部
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

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">专业数据分析</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                记录每一场对局，提供详细的五维雷达图与进阶数据，助你科学提升雀力。
            </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">公平竞技环境</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                完善的裁判系统与赛事规则，确保每一场比赛的公平性，让技术说话。
            </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">活跃社群</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
                汇聚各路高手，定期举办交流赛与教学活动，共同进步。
            </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
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
        <p className="text-xs text-slate-400 dark:text-slate-600 font-mono">
            © 2025 TIHO Riichi Club. All rights reserved.
        </p>
      </div>
    </div>
  );
};
