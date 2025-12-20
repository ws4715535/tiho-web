import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Edit2, Trash2, Save, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchRawRankData, deleteRankDataItem, updateRankDataItem, RankResponseItem } from '../services/supabaseService';
import { Arena } from '../types';
import { getWeekDateRange } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { AlertDialog } from '../components/ui/AlertDialog';

export const AdminManage = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(12);
  const [week, setWeek] = useState<number | 'All'>(3);
  const [arena, setArena] = useState<Arena>('大学城');
  
  const [data, setData] = useState<RankResponseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<RankResponseItem>>({});

  const loadData = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const result = await fetchRawRankData(year, month, week, arena);
      setData(result);
    } catch (err) {
      setError('加载数据失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteRankDataItem(itemToDelete);
      setData(prev => prev.filter(item => item.id !== itemToDelete));
      setSuccess('删除成功');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setError('删除失败');
    } finally {
      setDeleteLoading(false);
    }
  };

  const startEdit = (item: RankResponseItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (field: keyof RankResponseItem, value: any) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveEdit = async () => {
    if (!editingId) return;

    try {
      // Calculate total score if needed, but usually we trust manual input or auto-calc? 
      // For now trust manual input.
      await updateRankDataItem(editingId, editForm);
      
      setData(prev => prev.map(item => item.id === editingId ? { ...item, ...editForm } : item));
      setEditingId(null);
      setSuccess('更新成功');
    } catch (err) {
      setError('更新失败');
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, []); // Only mount? Or maybe not, let user click query. But usually admin wants to see something.
  // Actually let's not auto load to avoid accidental heavy queries, or maybe load with default. 
  // Let's load with current filters when they change? No, explicit query is safer for admin tools.
  // But let's do it on mount once.
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
                onClick={() => navigate('/ranking')}
                className="p-2 mr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
                <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">管理成绩数据</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/upload')}>
            前往上传
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <AlertDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="确认删除"
          description="确定要删除这条记录吗？此操作不可恢复，请谨慎操作。"
          onConfirm={confirmDelete}
          loading={deleteLoading}
          variant="destructive"
        />

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">年份</label>
              <select 
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">月份</label>
              <select 
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2"
              >
                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">比赛周</label>
              <select 
                value={week}
                onChange={(e) => {
                  const val = e.target.value;
                  setWeek(val === 'All' ? 'All' : parseInt(val));
                }}
                className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2"
              >
                {[1, 2, 3, 4].map(w => (
                  <option key={w} value={w}>第 {w} 周</option>
                ))}
                <option value="All">All</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">赛区</label>
              <select 
                value={arena}
                onChange={(e) => setArena(e.target.value as Arena)}
                className="w-full text-sm rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2"
              >
                <option value="大学城">大学城</option>
                <option value="李家村">李家村</option>
              </select>
            </div>
            <Button onClick={loadData} disabled={loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4 mr-1" />}
              查询
            </Button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
             {week === 'All' 
                ? `${year}年${month}月 全月数据`
                : getWeekDateRange(year, month, week)
             }
          </p>
        </div>

        {/* Messages */}
        {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
        )}
        {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              {success}
            </div>
        )}

        {/* Data Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3">昵称</th>
                    <th className="px-2 py-3 text-center">对局</th>
                    <th className="px-2 py-3 text-center">一位</th>
                    <th className="px-2 py-3 text-center">二位</th>
                    <th className="px-2 py-3 text-center">三位</th>
                    <th className="px-2 py-3 text-center">四位</th>
                    <th className="px-2 py-3 text-center">被飞</th>
                    <th className="px-4 py-3 text-right">总分</th>
                    <th className="px-4 py-3 text-right">PT</th>
                    <th className="px-4 py-3 text-center">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {data.length === 0 ? (
                      <tr>
                          <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                              暂无数据
                          </td>
                      </tr>
                  ) : (
                      data.map((item) => (
                        <tr key={item.id} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            {editingId === item.id ? (
                                <>
                                    <td className="px-4 py-2">
                                        <input 
                                            value={editForm.nickname} 
                                            onChange={e => handleEditChange('nickname', e.target.value)}
                                            className="w-24 p-1 border rounded dark:bg-slate-700 dark:border-slate-600"
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <input 
                                            type="number"
                                            value={editForm.game_count} 
                                            onChange={e => handleEditChange('game_count', parseInt(e.target.value))}
                                            className="w-12 p-1 border rounded text-center dark:bg-slate-700 dark:border-slate-600"
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <input 
                                            type="number"
                                            value={editForm.position1} 
                                            onChange={e => handleEditChange('position1', parseInt(e.target.value))}
                                            className="w-10 p-1 border rounded text-center dark:bg-slate-700 dark:border-slate-600"
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <input 
                                            type="number"
                                            value={editForm.position2} 
                                            onChange={e => handleEditChange('position2', parseInt(e.target.value))}
                                            className="w-10 p-1 border rounded text-center dark:bg-slate-700 dark:border-slate-600"
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <input 
                                            type="number"
                                            value={editForm.position3} 
                                            onChange={e => handleEditChange('position3', parseInt(e.target.value))}
                                            className="w-10 p-1 border rounded text-center dark:bg-slate-700 dark:border-slate-600"
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <input 
                                            type="number"
                                            value={editForm.position4} 
                                            onChange={e => handleEditChange('position4', parseInt(e.target.value))}
                                            className="w-10 p-1 border rounded text-center dark:bg-slate-700 dark:border-slate-600"
                                        />
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <input 
                                            type="number"
                                            value={editForm.busted} 
                                            onChange={e => handleEditChange('busted', parseInt(e.target.value))}
                                            className="w-10 p-1 border rounded text-center dark:bg-slate-700 dark:border-slate-600"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <input 
                                            type="number"
                                            step="0.1"
                                            value={editForm.total_score} 
                                            onChange={e => handleEditChange('total_score', parseFloat(e.target.value))}
                                            className="w-16 p-1 border rounded text-right dark:bg-slate-700 dark:border-slate-600"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <input 
                                            type="number"
                                            step="0.1"
                                            value={editForm.point} 
                                            onChange={e => handleEditChange('point', parseFloat(e.target.value))}
                                            className="w-16 p-1 border rounded text-right dark:bg-slate-700 dark:border-slate-600"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-center space-x-1">
                                        <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                            <Save className="w-4 h-4" />
                                        </button>
                                        <button onClick={cancelEdit} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="px-4 py-3 font-medium dark:text-white">{item.nickname}</td>
                                    <td className="px-2 py-3 text-center dark:text-slate-300">{item.game_count}</td>
                                    <td className="px-2 py-3 text-center text-slate-400">{item.position1}</td>
                                    <td className="px-2 py-3 text-center text-slate-400">{item.position2}</td>
                                    <td className="px-2 py-3 text-center text-slate-400">{item.position3}</td>
                                    <td className="px-2 py-3 text-center text-slate-400">{item.position4}</td>
                                    <td className="px-2 py-3 text-center text-slate-400">{item.busted}</td>
                                    <td className="px-4 py-3 text-right dark:text-slate-300">{item.total_score}</td>
                                    <td className={`px-4 py-3 text-right font-bold ${item.point >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {item.point}
                                    </td>
                                    <td className="px-4 py-3 text-center space-x-2">
                                        <button 
                                            onClick={() => startEdit(item)}
                                            className="p-1 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded transition-colors"
                                            title="编辑"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                                            title="删除"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
        </div>
      </div>
    </div>
  );
};
