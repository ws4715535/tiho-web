import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Users, Save, X, Loader2, RefreshCw, Image as ImageIcon, Database, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { fetchAllTeams, createTeam, updateTeam, deleteTeam, syncTeamScores, type PairedTeam } from '../services/teamService';
import { uploadImage } from '../services/supabaseService';

export const AdminTeamManager = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<PairedTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Form State
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    team_name: '',
    member_1_name: '',
    member_2_name: '',
    avatar_url: '',
    description: '',
    status: 'active',
    created_at: ''
  });

  // Fetch Teams
  const loadTeams = async () => {
    setLoading(true);
    try {
      const data = await fetchAllTeams();
      setTeams(data);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
      alert('获取战队列表失败，请检查网络或权限');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  // Handle Sync Scores
  const handleSyncScores = async () => {
    if (!confirm('确定要从外部数据源同步本周积分吗？这可能需要几秒钟。')) return;
    
    setSyncing(true);
    try {
      await syncTeamScores();
      await loadTeams(); // Reload to show new scores
      alert('积分同步完成！');
    } catch (err) {
      console.error('Sync failed:', err);
      alert('同步失败，请查看控制台日志');
    } finally {
      setSyncing(false);
    }
  };

  // Open Modal
  const openModal = (team?: PairedTeam) => {
    if (team) {
      setCurrentId(team.id);
      // Format datetime-local string (YYYY-MM-DDTHH:mm)
      let createdDate = '';
      if (team.created_at) {
          const d = new Date(team.created_at);
          // Adjust to local ISO string for input type="datetime-local"
          // We need YYYY-MM-DDTHH:mm
          // Simple hack: use toISOString() but adjust for timezone manually or just use string manipulation
          // Better:
          const offset = d.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
          createdDate = localISOTime;
      }

      setFormData({
        team_name: team.team_name,
        member_1_name: team.member_1_name,
        member_2_name: team.member_2_name,
        avatar_url: team.avatar_url || '',
        description: team.description || '',
        status: team.status || 'active',
        created_at: createdDate
      });
    } else {
      setCurrentId(null);
      // Default to now
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(now.getTime() - offset)).toISOString().slice(0, 16);
      
      setFormData({
        team_name: '',
        member_1_name: '',
        member_2_name: '',
        avatar_url: '',
        description: '',
        status: 'active',
        created_at: localISOTime
      });
    }
    setIsModalOpen(true);
  };

  // Handle Avatar Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Basic validation
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件');
        return;
    }
    
    setUploadingAvatar(true);
    try {
        const publicUrl = await uploadImage(file);
        setFormData((prev: any) => ({ ...prev, avatar_url: publicUrl }));
    } catch (err) {
        console.error('Avatar upload failed:', err);
        alert('头像上传失败: ' + (err instanceof Error ? err.message : '未知错误'));
    } finally {
        setUploadingAvatar(false);
    }
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.team_name || !formData.member_1_name || !formData.member_2_name) {
      alert('战队名和成员名为必填项');
      return;
    }

    setActionLoading(true);
    
    // Convert local datetime to UTC ISO string if needed, or just let Supabase handle ISO string
    // Supabase timestamptz expects ISO string.
    // formData.created_at is "YYYY-MM-DDTHH:mm" (local time from input)
    // We should convert it to a full ISO string with timezone or UTC
    
    let submissionData = { ...formData };
    if (formData.created_at) {
        const d = new Date(formData.created_at);
        submissionData.created_at = d.toISOString();
    }

    try {
      if (currentId) {
        // Update
        await updateTeam(currentId, submissionData);
      } else {
        // Insert
        await createTeam(submissionData);
      }

      setIsModalOpen(false);
      loadTeams(); // Refresh list
    } catch (err) {
      console.error('Operation failed:', err);
      alert('操作失败，请重试');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个战队吗？此操作不可恢复。')) return;

    setActionLoading(true); // Global loading or specific item loading? Global for simplicity
    try {
      await deleteTeam(id);
      loadTeams();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('删除失败');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 backdrop-blur-md bg-opacity-90 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              战队管理后台
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={loadTeams} 
                disabled={loading}
                className="text-slate-500"
            >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
                variant="outline"
                size="sm" 
                onClick={handleSyncScores} 
                disabled={syncing || loading}
                className="flex items-center gap-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            >
                <Database className={`w-4 h-4 ${syncing ? 'animate-pulse' : ''}`} />
                {syncing ? '同步中...' : '同步积分'}
            </Button>
            <Button size="sm" onClick={() => openModal()} className="flex items-center gap-1 shadow-lg shadow-indigo-500/20">
                <Plus className="w-4 h-4" />
                新建战队
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Loading State */}
        {loading && teams.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500" />
                <p>正在同步云端数据...</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map(team => (
                    <div key={team.id} className="group bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-200 relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                                {team.avatar_url ? (
                                    <img src={team.avatar_url} alt={team.team_name} className="w-14 h-14 rounded-xl object-cover shadow-sm border border-slate-100 dark:border-slate-600" />
                                ) : (
                                    <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                                        {team.team_name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{team.team_name}</h3>
                                        {team.status === 'inactive' && (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 max-w-[120px]">
                                        {team.description || '暂无描述'}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">PT</div>
                                <div className={`text-xl font-mono font-black ${team.total_score >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-500'}`}>
                                    {team.total_score > 0 ? '+' : ''}{parseFloat(team.total_score.toFixed(1))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 mb-4 border border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center justify-around text-sm font-medium text-slate-700 dark:text-slate-200">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                                    {team.member_1_name}
                                </span>
                                <span className="text-slate-300 dark:text-slate-600">|</span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                                    {team.member_2_name}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                            <button 
                                onClick={() => openModal(team)}
                                className="flex-1 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                                编辑
                            </button>
                            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                            <button 
                                onClick={() => handleDelete(team.id)}
                                className="flex-1 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                删除
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {currentId ? '编辑战队信息' : '创建新战队'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    战队名称 <span className="text-rose-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.team_name}
                                    onChange={e => setFormData({...formData, team_name: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                    placeholder="例如：天和双子星"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        成员 1 <span className="text-rose-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.member_1_name}
                                        onChange={e => setFormData({...formData, member_1_name: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        placeholder="队长昵称"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                        成员 2 <span className="text-rose-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        value={formData.member_2_name}
                                        onChange={e => setFormData({...formData, member_2_name: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        placeholder="队员昵称"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    头像 URL
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="url" 
                                            value={formData.avatar_url}
                                            onChange={e => setFormData({...formData, avatar_url: e.target.value})}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <label className={`flex items-center justify-center px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors ${uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        {uploadingAvatar ? <Loader2 className="w-5 h-5 animate-spin text-indigo-500" /> : <Upload className="w-5 h-5 text-slate-500 dark:text-slate-400" />}
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            disabled={uploadingAvatar}
                                        />
                                    </label>
                                </div>
                                {formData.avatar_url && (
                                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                        <img src={formData.avatar_url} alt="Preview" className="w-6 h-6 rounded-md object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                        <span>预览</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    战队描述
                                </label>
                                <textarea 
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-24"
                                    placeholder="输入战队口号或简介..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    成立时间
                                </label>
                                <input 
                                    type="datetime-local" 
                                    value={formData.created_at}
                                    onChange={e => setFormData({...formData, created_at: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                                    战队状态
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({...formData, status: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
                                >
                                    <option value="active">🟢 活跃中 (Active)</option>
                                    <option value="inactive">🔴 不活跃 (Inactive)</option>
                                </select>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={actionLoading}
                            className="w-full py-3 text-base font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    处理中...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    {currentId ? '保存修改' : '立即创建'}
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
