import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Calendar, Sparkles, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AVATAR_URLS } from '../constants/avatarUrls';

// Mock registered teams data (simplified for intro page)
const REGISTERED_TEAMS = [
  { name: '天和双子星', avatar: AVATAR_URLS[0], slogan: '不仅要赢，还要赢得漂亮！', members: ['队员A0', '队员B0'] },
  { name: '岭上开花', avatar: AVATAR_URLS[1], slogan: '花开富贵，杠上开花。', members: ['队员A1', '队员B1'] },
  { name: '海底捞月', avatar: AVATAR_URLS[2], slogan: '不到最后一刻决不放弃。', members: ['队员A2', '队员B2'] },
  { name: '国士无双', avatar: AVATAR_URLS[3], slogan: '十三面听牌，你怕不怕？', members: ['队员A3', '队员B3'] },
  { name: '九莲宝灯', avatar: AVATAR_URLS[4], slogan: '传说中的役满，即将在我们手中诞生。', members: ['队员A4', '队员B4'] },
  { name: '大三元', avatar: AVATAR_URLS[5], slogan: '白发中，缺一不可。', members: ['队员A5', '队员B5'] },
  { name: '小四喜', avatar: AVATAR_URLS[6], slogan: '东西南北，风起云涌。', members: ['队员A6', '队员B6'] },
  { name: '清老头', avatar: AVATAR_URLS[7], slogan: '只有老头牌才是真理。', members: ['队员A7', '队员B7'] },
];

export const TeamMatchIntro = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<typeof REGISTERED_TEAMS[0] | null>(null);

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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 opacity-90"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>
        </div>

        <div className="relative z-10 px-6 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-pink-300 mb-6 animate-pulse">
            <Sparkles className="w-3 h-3" />
            S1 赛季火热进行中
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter text-white mb-4 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">双人成行</span>
            <br />
            <span className="text-indigo-200">搭档立直赛</span>
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base font-medium max-w-md mx-auto leading-relaxed mb-8">
            寻找你的灵魂拍档，在牌桌上展现无间默契。双倍的策略，双倍的快乐，共同冲击年度最强组合荣誉！
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/ranking?cat=team')}
              className="w-full sm:w-auto px-8 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-bold shadow-lg shadow-indigo-900/20 border-none"
            >
              <Trophy className="w-4 h-4 mr-2" />
              查看战队榜单
            </Button>
            <div className="text-xs text-slate-400 font-mono">
              已有 24 支战队报名参赛
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6 relative z-10 space-y-6">
        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">比赛时间</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">待定</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">赛制规则</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">2人组队 · 4人半庄<br/>积分共享 · 配合战术</p>
          </div>
        </div>

        {/* Introduction Content */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
              赛事介绍
            </h3>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                「双人成行」是 Tiho Club 首创的特色娱乐赛事。不同于传统的单人竞技，本赛事要求两名选手组成固定战队，在赛季内共同累积积分。
              </p>
              <p>
                比赛采用标准日麻规则，但在战术层面上，更加考验队友之间的默契与配合。无论是进攻还是防守，都需要考虑团队整体利益，制定更具深度的对局策略。
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-pink-500 rounded-full"></span>
              参赛奖励
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-300">
                待定
            </div>
          </div>
        </div>

        {/* Registered Teams Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">已报名战队</h3>
            <button 
                onClick={() => navigate('/team-list')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
                全部战队 &gt;
            </button>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {REGISTERED_TEAMS.map((team, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center gap-2 group cursor-pointer"
                onClick={() => setSelectedTeam(team)}
              >
                <div className="relative">
                  <img 
                    src={team.avatar} 
                    alt={team.name} 
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform" 
                  />
                  {idx < 3 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">★</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium text-center truncate w-full px-1">
                  {team.name}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => navigate('/team-list')}>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500 transition-colors">
                    <span className="text-xs font-bold">More</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">查看更多</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Info Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-xs rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedTeam(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <img 
                src={selectedTeam.avatar} 
                alt={selectedTeam.name} 
                className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white dark:border-slate-700" 
              />
              
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{selectedTeam.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">
                  "{selectedTeam.slogan}"
                </p>
              </div>

              <div className="w-full bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">战队成员</div>
                <div className="flex justify-center gap-4">
                  {selectedTeam.members.map((member, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {member.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
