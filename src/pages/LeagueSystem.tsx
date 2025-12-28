import { TrendingUp, Trophy, Calendar, Medal, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const LeagueSystem = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            联赛体系
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
            <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">年度积分联赛</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            TIHO 联赛采取年度积分制，分为春、夏、秋、冬四个赛季。选手通过参与日常对局获取联赛积分，积分将决定您在季度赛和年度总决赛的入围资格。
          </p>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">赛程安排</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            每个赛季持续3个月，最后一周为季后赛。年度总决赛通常在次年1月举行，汇聚全年表现最优秀的顶尖选手，争夺年度雀王的至高荣誉。
          </p>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center mb-4">
            <Medal className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">奖励机制</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            除了丰厚的奖金池，获奖选手还将获得定制奖杯、专属周边以及 TIHO 官方认证的段位证书。您的名字将被永久铭刻在 TIHO 名人堂中。
          </p>
        </section>
      </main>
    </div>
  );
};
