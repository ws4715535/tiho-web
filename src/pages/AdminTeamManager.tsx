import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, Users, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { generateMockTeamData } from '../services/mockTeamData';
import { Competitor } from '../types';

export const AdminTeamManager = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Competitor | null>(null);

  useEffect(() => {
    // Load initial mock data
    const loadData = async () => {
      const data = generateMockTeamData(5);
      setTeams(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    setIsModalOpen(false);
    setEditingTeam(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('确认删除该战队吗？')) {
      setTeams(teams.filter(t => t.id !== id));
    }
  };

  const openEdit = (team: Competitor) => {
    setEditingTeam(team);
    setIsModalOpen(true);
  };

  const openNew = () => {
    setEditingTeam(null);
    setIsModalOpen(true);
  };

  const getContribution = (score: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((score / total) * 100);
  };

  const getScoreColor = (val: number) => {
    if (val > 0) return 'text-red-500 dark:text-red-400';
    if (val < 0) return 'text-green-500 dark:text-green-400';
    return 'text-slate-500 dark:text-slate-400';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10 backdrop-blur-md bg-opacity-90 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg text-slate-900 dark:text-white">战队管理</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                双人赛战队列表
            </h2>
            <Button size="sm" onClick={openNew} className="flex items-center gap-1">
                <Plus className="w-4 h-4" />
                新建战队
            </Button>
        </div>

        {loading ? (
             <div className="text-center py-10 text-slate-500">加载中...</div>
        ) : (
            <div className="space-y-3">
                {teams.map(team => (
                    <div key={team.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {team.avatar ? (
                                <img src={team.avatar} alt="" className="w-12 h-12 rounded-lg object-cover" />
                            ) : (
                                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-600">
                                    {team.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{team.name}</h3>
                                <div className="flex items-center gap-1 mt-1">
                                    {team.members?.map((m, i) => {
                                        const score = m.score ?? 0;
                                        const contribution = getContribution(score, team.totalPT);
                                        return (
                                            <span key={i} className="text-xs px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded flex items-center gap-1">
                                                <span>{m.name}</span>
                                                <span className="text-[10px] text-slate-400">|</span>
                                                <span className={`font-mono ${getScoreColor(contribution)}`}>{contribution}%</span>
                                                <span className={`font-mono text-[10px] ${getScoreColor(score)}`}>
                                                    ({score > 0 ? '+' : ''}{score})
                                                </span>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(team)} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(team.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Edit/New Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {editingTeam ? '编辑战队' : '新建战队'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">战队名称</label>
                        <input 
                            type="text" 
                            defaultValue={editingTeam?.name}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="请输入战队名称"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">队长</label>
                        <input 
                            type="text" 
                            defaultValue={editingTeam?.members?.[0]?.name}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="请输入队长昵称"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">队员</label>
                        <input 
                            type="text" 
                            defaultValue={editingTeam?.members?.[1]?.name}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="请输入队员昵称"
                        />
                    </div>
                    
                    <Button type="submit" className="w-full mt-4 flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        保存信息
                    </Button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
