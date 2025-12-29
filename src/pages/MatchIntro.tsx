import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trophy, Calendar, Sparkles, User, Users, Loader2, FileText, Download, QrCode, X, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase/client';

interface Tournament {
  id: string;
  title: string;
  subtitle: string;
  type: 'team' | 'individual';
  status: string;
  intro: string;
  full_intro: string;
  match_time_desc: string;
  rules_desc: string;
  rewards_desc: string;
  banner_gradient_from: string;
  banner_gradient_to: string;
  pdf_url?: string;
  doc_link?: string;
  registration_contact1_name?: string;
  registration_contact1_wechat?: string;
  registration_contact1_qr?: string;
  registration_contact2_name?: string;
  registration_contact2_wechat?: string;
  registration_contact2_qr?: string;
}

export const MatchIntro = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('微信号已复制');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    const fetchTournament = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setTournament(data);
      } catch (err) {
        console.error('Error fetching tournament:', err);
        // Fallback or error handling
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500">
        <p>赛事不存在</p>
        <Button onClick={() => navigate('/')} className="mt-4">返回首页</Button>
      </div>
    );
  }

  // Check if any registration info exists
  const hasRegistration = tournament.registration_contact1_name || tournament.registration_contact1_qr || tournament.registration_contact2_name || tournament.registration_contact2_qr;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 animate-in fade-in duration-500">
      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowRegistration(false)}>
           <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-6 relative" onClick={e => e.stopPropagation()}>
              <button 
                  onClick={() => setShowRegistration(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                  <X className="w-5 h-5 text-slate-500" />
              </button>
              
              <h3 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-6">赛事报名</h3>
              
              <div className="space-y-8">
                  {/* Contact 1 */}
                  {(tournament.registration_contact1_name || tournament.registration_contact1_qr) && (
                      <div className="flex flex-col items-center text-center space-y-3">
                          {tournament.registration_contact1_qr ? (
                              <div className="w-48 h-48 bg-slate-100 dark:bg-slate-700 rounded-xl p-2 border-2 border-dashed border-slate-300 dark:border-slate-600">
                                  <img src={tournament.registration_contact1_qr} alt="报名二维码1" className="w-full h-full object-contain rounded-lg" />
                              </div>
                          ) : (
                              <div className="w-48 h-48 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400">
                                  暂无二维码
                              </div>
                          )}
                          <div>
                              <div className="font-bold text-lg text-slate-900 dark:text-white">{tournament.registration_contact1_name || '报名联系人'}</div>
                              {tournament.registration_contact1_wechat && (
                                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                      <span>微信号: <span className="font-mono select-all">{tournament.registration_contact1_wechat}</span></span>
                                      <button 
                                        onClick={() => handleCopy(tournament.registration_contact1_wechat!)}
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-indigo-500 transition-colors"
                                        title="复制微信号"
                                      >
                                          <Copy className="w-3.5 h-3.5" />
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  )}

                  {/* Divider if both exist */}
                  {(tournament.registration_contact1_name || tournament.registration_contact1_qr) && (tournament.registration_contact2_name || tournament.registration_contact2_qr) && (
                      <div className="w-full h-px bg-slate-200 dark:bg-slate-700"></div>
                  )}

                  {/* Contact 2 */}
                  {(tournament.registration_contact2_name || tournament.registration_contact2_qr) && (
                      <div className="flex flex-col items-center text-center space-y-3">
                          {tournament.registration_contact2_qr ? (
                              <div className="w-48 h-48 bg-slate-100 dark:bg-slate-700 rounded-xl p-2 border-2 border-dashed border-slate-300 dark:border-slate-600">
                                  <img src={tournament.registration_contact2_qr} alt="报名二维码2" className="w-full h-full object-contain rounded-lg" />
                              </div>
                          ) : (
                              <div className="w-48 h-48 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center text-slate-400">
                                  暂无二维码
                              </div>
                          )}
                          <div>
                              <div className="font-bold text-lg text-slate-900 dark:text-white">{tournament.registration_contact2_name || '报名联系人'}</div>
                              {tournament.registration_contact2_wechat && (
                                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                      <span>微信号: <span className="font-mono select-all">{tournament.registration_contact2_wechat}</span></span>
                                      <button 
                                        onClick={() => handleCopy(tournament.registration_contact2_wechat!)}
                                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-indigo-500 transition-colors"
                                        title="复制微信号"
                                      >
                                          <Copy className="w-3.5 h-3.5" />
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  )}

                  {!hasRegistration && (
                      <div className="text-center text-slate-500 py-8">
                          暂未配置报名信息
                      </div>
                  )}
              </div>
              
              <p className="text-center text-xs text-slate-400 mt-6">
                  请添加联系人微信或扫码进行报名咨询
              </p>

              {/* Toast Notification */}
              {copySuccess && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    {copySuccess}
                </div>
              )}
           </div>
        </div>
      )}

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
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br from-${tournament.banner_gradient_from} via-slate-900 to-slate-900 opacity-90`} style={{ background: `linear-gradient(to bottom right, ${tournament.banner_gradient_from}, #0f172a)` }}></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20"></div>
        </div>

        <div className="relative z-10 px-6 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white mb-6 animate-pulse">
            <Sparkles className="w-3 h-3" />
            {tournament.status === 'active' ? '火热进行中' : (tournament.status === 'upcoming' ? '即将开始' : '已结束')}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black italic tracking-tighter text-white mb-4 leading-tight whitespace-pre-wrap">
            {tournament.title}
            <br />
            <span className="text-indigo-200 text-2xl not-italic">{tournament.subtitle}</span>
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base font-medium max-w-md mx-auto leading-relaxed mb-8">
            {tournament.intro}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate(tournament.type === 'team' ? '/ranking?cat=team' : '/ranking?cat=individual')}
              className="w-full sm:w-auto px-8 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-bold shadow-lg shadow-indigo-900/20 border-none"
            >
              <Trophy className="w-4 h-4 mr-2" />
              查看榜单
            </Button>
            
            {tournament.status !== 'archived' && (
                <Button 
                  onClick={() => setShowRegistration(true)}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700 font-bold shadow-lg shadow-pink-900/20 border-none"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  一键报名
                </Button>
            )}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap">{tournament.match_time_desc || '待定'}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3">
              {tournament.type === 'team' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">赛制规则</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap">{tournament.rules_desc || '暂无详细规则'}</p>
          </div>
        </div>

        {/* Introduction Content */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
              赛事介绍
            </h3>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {tournament.full_intro || tournament.intro}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-1 h-5 bg-pink-500 rounded-full"></span>
              参赛奖励
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {tournament.rewards_desc || '待定'}
            </div>
          </div>

          {(tournament.pdf_url || tournament.doc_link) && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
                详细规则说明书
              </h3>
              <div className="space-y-3">
                {tournament.pdf_url && (
                    <a 
                        href={tournament.pdf_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">赛事手册 PDF</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">点击在线阅读或下载</div>
                        </div>
                        </div>
                        <Download className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </a>
                )}
                
                {tournament.doc_link && (
                    <a 
                        href={tournament.doc_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                            <ExternalLink className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 dark:text-white text-sm">在线文档链接</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">点击跳转至外部文档</div>
                        </div>
                        </div>
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors rotate-180" />
                    </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
