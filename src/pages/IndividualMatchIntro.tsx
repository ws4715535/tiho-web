import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Calendar, Sparkles, User, Target, Crown } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const IndividualMatchIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 animate-in fade-in duration-500">
      {/* Navigation Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg text-slate-900 dark:text-white">赛事详情</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative bg-slate-900 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 opacity-90"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>
        </div>

        <div className="relative z-10 px-6 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-300 mb-6 animate-pulse">
            <Sparkles className="w-3 h-3" />
            S1 赛季火热进行中
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter text-white mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">最强雀士</span>
            <br />
            <span className="text-slate-200">个人排位赛</span>
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base font-medium max-w-md mx-auto leading-relaxed mb-8">
            在这个舞台上，你只需要相信自己的判断。运筹帷幄，决胜千里，向着“天和最强”的称号发起冲击！
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/ranking?cat=individual')}
              className="w-full sm:w-auto px-8 py-3 bg-white text-slate-900 hover:bg-cyan-50 font-bold shadow-lg shadow-cyan-900/20 border-none"
            >
              <Trophy className="w-4 h-4 mr-2" />
              查看个人榜单
            </Button>
            <div className="text-xs text-slate-400 font-mono">
              已有 100+ 选手参与角逐
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10 space-y-6">
        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-3">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">比赛时间</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">全年进行<br/>随时参与</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">赛制规则</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">单人排位 · 积分制<br/>周月结算 · 争夺榜首</p>
          </div>
        </div>

        {/* Introduction Content */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-cyan-500 rounded-full"></span>
              赛事介绍
            </h3>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                「个人排位赛」是 Tiho Club 的核心常驻赛事。无论你是刚刚入门的新手，还是身经百战的雀豪，这里都有属于你的位置。
              </p>
              <p>
                通过每一场对局累积积分，实时更新周榜与月榜排名。每周与每月结算时，位于榜单前列的选手将获得丰厚奖励与荣誉，用实力证明你是真正的天和最强！
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
              奖励结算
            </h3>
             <div className="text-sm text-slate-600 dark:text-slate-300">
                待定
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
