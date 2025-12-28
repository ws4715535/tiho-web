import { Shield, Scale, Gavel, FileCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const FairPlay = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-500" />
            公平竞技环境
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
            <Scale className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">统一赛事规则</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            TIHO 采用标准化的日麻赛事规则，对常见的争议点（如流局、包牌、诈和等）有明确的判定标准。所有参赛选手需在赛前阅读并同意遵守规则手册。
          </p>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
            <Gavel className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">专业裁判系统</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            不管是线上还是线下赛事，我们都设有裁判组。对局中出现的任何争议，均由裁判依据规则进行公正裁决，确保比赛结果的权威性。
          </p>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center mb-4">
            <FileCheck className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">违规处罚机制</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            对于作弊、恶意拖延、辱骂对手等破坏竞技环境的行为，我们采取零容忍态度。一经查实，将视情节轻重给予警告、扣分、禁赛甚至永久除名的处罚。
          </p>
        </section>
      </main>
    </div>
  );
};
