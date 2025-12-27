import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Trophy, Save, X, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase/client';

interface Tournament {
  id: string;
  title: string;
  subtitle: string;
  type: 'team' | 'individual';
  status: 'active' | 'archived' | 'upcoming';
  banner_url: string;
  banner_gradient_from: string;
  banner_gradient_to: string;
  intro: string;
  full_intro: string;
  match_time_desc: string;
  rules_desc: string;
  rewards_desc: string;
  sort_order: number;
}

export const AdminTournamentManager = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Colors for picker
  const GRADIENT_COLORS = [
    'pink-500', 'rose-600', 'purple-600', 'indigo-600', 'blue-600', 'cyan-500', 'emerald-500', 'amber-500', 'orange-500', 'slate-900'
  ];

  // Form State
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Tournament>>({
    title: '',
    subtitle: '',
    type: 'team',
    status: 'active',
    banner_url: '',
    banner_gradient_from: 'pink-500',
    banner_gradient_to: 'rose-600',
    intro: '',
    full_intro: '',
    match_time_desc: '',
    rules_desc: '',
    rewards_desc: '',
    sort_order: 0
  });

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTournaments(data || []);
    } catch (err) {
      console.error('Failed to fetch tournaments:', err);
      alert('获取赛事列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const openModal = (tournament?: Tournament) => {
    if (tournament) {
      setCurrentId(tournament.id);
      setFormData({ ...tournament });
    } else {
      setCurrentId(null);
      setFormData({
        title: '',
        subtitle: '',
        type: 'team',
        status: 'active',
        banner_url: '',
        banner_gradient_from: 'pink-500',
        banner_gradient_to: 'rose-600',
        intro: '',
        full_intro: '',
        match_time_desc: '',
        rules_desc: '',
        rewards_desc: '',
        sort_order: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.type) {
      alert('赛事标题和类型为必填项');
      return;
    }

    setActionLoading(true);
    try {
      if (currentId) {
        const { error } = await supabase
          .from('tournaments')
          .update(formData)
          .eq('id', currentId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('tournaments')
          .insert([formData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchTournaments();
    } catch (err) {
      console.error('Operation failed:', err);
      alert('操作失败');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个赛事吗？')) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTournaments();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('删除失败');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 font-sans">
      <div className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 backdrop-blur-md bg-opacity-90 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              赛事配置后台
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchTournaments} disabled={loading} className="text-slate-500">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="sm" onClick={() => openModal()} className="flex items-center gap-1">
                <Plus className="w-4 h-4" />
                新建赛事
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto p-4">
        {loading && tournaments.length === 0 ? (
           <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" /></div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {tournaments.map(t => (
              <div key={t.id} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {t.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">#{t.sort_order}</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t.subtitle}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openModal(t)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-rose-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <div className={`h-24 rounded-lg bg-gradient-to-r from-${t.banner_gradient_from} to-${t.banner_gradient_to} relative overflow-hidden flex items-center p-4 text-white`}>
                   {/* Fallback if gradient classes don't work dynamically without safelist, use style */}
                   <div className="absolute inset-0" style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}></div> 
                   {/* Actually let's just use the style for gradients to be safe */}
                   <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${t.banner_gradient_from}, ${t.banner_gradient_to})` }}></div>
                   
                   <div className="relative z-10">
                     <div className="font-bold text-lg">{t.title}</div>
                     <div className="text-xs opacity-80 line-clamp-2">{t.intro}</div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="bg-slate-50 dark:bg-slate-700/30 p-2 rounded">
                    <span className="font-bold block mb-0.5">类型</span>
                    {t.type === 'team' ? '双人赛' : '个人赛'}
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/30 p-2 rounded">
                    <span className="font-bold block mb-0.5">时间</span>
                    <span className="line-clamp-1">{t.match_time_desc || '待定'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
             <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
               <h3 className="font-bold text-lg dark:text-white">{currentId ? '编辑赛事' : '新建赛事'}</h3>
               <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
             </div>
             <div className="p-6 overflow-y-auto">
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-4">
                     <div>
                        <label className="form-label">标题</label>
                        <input className="w-full input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                     </div>
                     <div>
                        <label className="form-label">副标题</label>
                        <input className="w-full input-field" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="form-label">类型</label>
                          <select className="w-full input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                            <option value="team">双人赛</option>
                            <option value="individual">个人赛</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">状态</label>
                          <select className="w-full input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                            <option value="active">进行中 (Active)</option>
                            <option value="upcoming">即将开始 (Upcoming)</option>
                            <option value="archived">已归档 (Archived)</option>
                          </select>
                        </div>
                     </div>
                     <div>
                        <label className="form-label">排序权重 (数字越小越靠前)</label>
                        <input type="number" className="w-full input-field" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})} />
                     </div>
                     
                     <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                        <label className="form-label mb-3">Banner 背景渐变色</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs text-slate-500 mb-1 block">起始色</span>
                                <div className="flex flex-wrap gap-2">
                                    {GRADIENT_COLORS.map(c => (
                                        <button 
                                            key={c} type="button" 
                                            className={`w-6 h-6 rounded-full border-2 ${formData.banner_gradient_from === c ? 'border-indigo-500 scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: `var(--color-${c})` }} // Note: Tailwind colors need mapping or class usage
                                            onClick={() => setFormData({...formData, banner_gradient_from: c})}
                                        >
                                            <div className={`w-full h-full rounded-full bg-${c}`}></div>
                                        </button>
                                    ))}
                                    <input className="w-full text-xs input-field mt-1" placeholder="自定义类名" value={formData.banner_gradient_from} onChange={e => setFormData({...formData, banner_gradient_from: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 mb-1 block">结束色</span>
                                <div className="flex flex-wrap gap-2">
                                    {GRADIENT_COLORS.map(c => (
                                        <button 
                                            key={c} type="button" 
                                            className={`w-6 h-6 rounded-full border-2 ${formData.banner_gradient_to === c ? 'border-indigo-500 scale-110' : 'border-transparent'}`}
                                            onClick={() => setFormData({...formData, banner_gradient_to: c})}
                                        >
                                            <div className={`w-full h-full rounded-full bg-${c}`}></div>
                                        </button>
                                    ))}
                                    <input className="w-full text-xs input-field mt-1" placeholder="自定义类名" value={formData.banner_gradient_to} onChange={e => setFormData({...formData, banner_gradient_to: e.target.value})} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(to right, ${formData.banner_gradient_from?.includes('-') ? '' : formData.banner_gradient_from}, ${formData.banner_gradient_to?.includes('-') ? '' : formData.banner_gradient_to})` }}>
                            {/* Hacky preview since we rely on Tailwind classes mostly */}
                            <div className={`w-full h-full rounded-lg bg-gradient-to-r from-${formData.banner_gradient_from} to-${formData.banner_gradient_to} flex items-center justify-center`}>
                                预览效果
                            </div>
                        </div>
                     </div>
                   </div>

                   <div className="space-y-4">
                      <div>
                         <label className="form-label">简介 (Banner显示)</label>
                         <textarea className="w-full input-field h-24 resize-none" value={formData.intro} onChange={e => setFormData({...formData, intro: e.target.value})} />
                      </div>
 
                      <div>
                         <label className="form-label">详细介绍</label>
                         <textarea className="w-full input-field h-32 resize-none" value={formData.full_intro} onChange={e => setFormData({...formData, full_intro: e.target.value})} />
                      </div>
                      
                      <div>
                         <label className="form-label">规则描述</label>
                         <textarea className="w-full input-field h-24 resize-none" value={formData.rules_desc} onChange={e => setFormData({...formData, rules_desc: e.target.value})} />
                      </div>
                    </div>
                  </div>
 
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                     <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                         <Trophy className="w-5 h-5 text-amber-500" /> 
                         奖励配置
                     </h4>
                     <div className="grid grid-cols-1 gap-4">
                         <div>
                             <label className="form-label">奖励详细描述</label>
                             <textarea 
                                 className="w-full input-field h-32 font-mono text-sm" 
                                 placeholder="支持多行文本，描述各名次奖励..."
                                 value={formData.rewards_desc} 
                                 onChange={e => setFormData({...formData, rewards_desc: e.target.value})} 
                             />
                         </div>
                         <div>
                             <label className="form-label">比赛时间描述</label>
                             <input className="w-full input-field" value={formData.match_time_desc} onChange={e => setFormData({...formData, match_time_desc: e.target.value})} />
                         </div>
                     </div>
                  </div>

                 <Button type="submit" disabled={actionLoading} className="w-full py-4 text-base">
                    {actionLoading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                    保存配置
                 </Button>
               </form>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .input-field {
          @apply px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all;
        }
        .form-label {
          @apply block text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2;
        }
      `}</style>
    </div>
  );
};
