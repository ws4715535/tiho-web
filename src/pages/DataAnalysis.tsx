import { Activity, BarChart2, PieChart, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const DataAnalysis = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            专业数据分析
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
            <BarChart2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">全维度数据记录</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            我们记录每一位选手的对局详情，包括顺位分布、得点情况、和牌率、放铳率等基础数据。通过长期的积累，为您呈现真实的实力曲线。
          </p>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
            <PieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">五维雷达图</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            基于对局数据，我们为每位选手生成专属的五维雷达图（进攻、防守、速度、运势、读牌），直观展示您的雀力构成，帮助您发现短板与优势。
          </p>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">进阶分析报告</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            针对联赛选手，我们提供赛季总结报告，分析您在不同赛区、不同对手情况下的表现，助您在接下来的比赛中制定更科学的战术。
          </p>
        </section>
      </main>
    </div>
  );
};
