import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { saveRankData, Raw } from '../services/data';
import { uploadRankData, fetchExternalRankData } from '../services/supabaseService';
import { Arena } from '../types';
import { getWeekDateRange } from '../lib/utils';
import { getStoreConfig } from '../constants/stores';

export const AdminUpload = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(12);
  const [week, setWeek] = useState(3);
  const [arena, setArena] = useState<Arena>('大学城');
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Raw[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoUpdating, setAutoUpdating] = useState(false);
  const [showAllPreview, setShowAllPreview] = useState(false);

  const handleAutoUpdate = async () => {
    setAutoUpdating(true);
    setError('');
    setSuccess('');
    
    try {
      // Format date as YYYY-MM-DD - YYYY-MM-DD
      const dateRange = getWeekDateRange(year, month, week).replace(/\//g, '-');
      
      const storeConfig = getStoreConfig(arena);
      const data = await fetchExternalRankData(dateRange, storeConfig.id, storeConfig.limit);
      
      if (!data || !data.success || !Array.isArray(data.list)) {
        throw new Error('返回数据格式错误');
      }

      // Map response to Raw[]
      const mappedData: Raw[] = data.list.map((item: any) => ({
        name: item.username || '',
        avatar: item.avatarUrl,
        games: Number(item.total || 0),
        first: Number(item.one || 0),
        second: Number(item.two || 0),
        third: Number(item.three || 0),
        fourth: Number(item.four || 0),
        bifei: Number(item.fly || 0),
        total: Number(item.score || 0),
        pt: Number(item.point || 0)
      })).filter((item: Raw) => item.name); // Filter out invalid items

      if (mappedData.length === 0) {
        setError('未查询到相关比赛数据');
      } else {
        setPreviewData(mappedData);
        setSuccess(`成功获取 ${mappedData.length} 条比赛记录`);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '自动更新失败');
    } finally {
      setAutoUpdating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess('');
      parseFile(e.target.files[0]);
    }
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = text.split('\n').map(row => row.trim()).filter(row => row);
        
        // Simple CSV parser
        // Assumes format: 排名, 昵称, 对局, 一位, 二位, 三位, 四位, 被飞, 总分, 点数
        // Headers might be present
        
        const data: Raw[] = [];
        let startIndex = 0;
        
        // Detect header
        if (rows[0].includes('昵称') || rows[0].includes('对局类型')) {
          startIndex = 1;
        }

        for (let i = startIndex; i < rows.length; i++) {
          // Handle potential quotes or tabs if copied from Excel
          // If it's real CSV, split by comma. If tab-separated, split by tab.
          // Let's try to detect delimiter
          const line = rows[i];
          const delimiter = line.includes('\t') ? '\t' : ',';
          
          // Basic splitting, doesn't handle commas inside quotes for now (names shouldn't have commas usually)
          const cols = line.split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
          
          if (cols.length < 10) continue;

          // Map columns based on user provided format:
          // 对局类型(0) 头像(1) 昵称(2) 阶段(3) 等级(4) 到店(5) 签到(6) 消费(7) 对局(8) 一位(9) 二位(10) 三位(11) 四位(12) 被飞(13) 总分(14) 点数(15)
          
          const raw: Raw = {
            name: cols[2],
            games: parseInt(cols[8]) || 0,
            first: parseInt(cols[9]) || 0,
            second: parseInt(cols[10]) || 0,
            third: parseInt(cols[11]) || 0,
            fourth: parseInt(cols[12]) || 0,
            bifei: parseInt(cols[13]) || 0,
            total: parseFloat(cols[14]) || 0,
            pt: parseFloat(cols[15]) || 0
          };

          if (raw.name) {
            data.push(raw);
          }
        }
        
        setPreviewData(data);
      } catch (err) {
        setError('解析文件失败，请检查格式');
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    if (previewData.length === 0) {
      setError('没有可保存的数据');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Upload to Supabase Edge Function
      await uploadRankData(year, month, week, arena, previewData);
      
      // 2. Save locally (optional, for immediate fallback or cache)
      const monthStr = `${year}年${month}月`;
      saveRankData(monthStr, week, arena, 'individual', previewData);
      
      setSuccess(`成功上传 ${previewData.length} 条记录到云端数据库`);
      
      // Clear after delay
      // setTimeout(() => {
      //   navigate('/');
      // }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate('/ranking')}
            className="p-2 mr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">上传成绩数据</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Configuration */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h2 className="font-semibold text-lg dark:text-white mb-4">比赛信息配置</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">年份</label>
              <select 
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2.5"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">月份</label>
              <select 
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2.5"
              >
                {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">比赛周</label>
              <select 
                value={week}
                onChange={(e) => setWeek(parseInt(e.target.value))}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2.5"
              >
                {[1, 2, 3, 4].map(w => (
                  <option key={w} value={w}>第 {w} 周</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 pl-1">
                {getWeekDateRange(year, month, week).replace(/\//g, '年').replace(/- (\d{4})/, '- $1')
                  .replace(/(\d{4})年(\d{2})年(\d{2})/, '$1年$2月$3日')
                  .replace(/ - (\d{4})年(\d{2})年(\d{2})/, ' - $1年$2月$3日')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">赛区</label>
              <select 
                value={arena}
                onChange={(e) => setArena(e.target.value as Arena)}
                className="w-full rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white p-2.5"
              >
                <option value="大学城">大学城</option>
                <option value="李家村">李家村</option>
              </select>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg dark:text-white">上传 CSV 文件</h2>
            <button
              onClick={handleAutoUpdate}
              disabled={autoUpdating || loading}
              className="px-3 py-1.5 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1 font-medium disabled:opacity-50"
            >
              {autoUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              自动更新
            </button>
          </div>
          
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              accept=".csv,.txt" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="h-10 w-10 mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              点击或拖拽上传 CSV 文件
            </p>
            <p className="text-xs text-slate-400 mt-1">
              格式：对局类型, 头像, 昵称, 阶段, 等级, 到店, 签到, 消费, 对局, 一位, 二位, 三位, 四位, 被飞, 总分, 点数
            </p>
          </div>

          {file && (
            <div className="mt-4 flex items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <FileText className="h-5 w-5 text-indigo-500 mr-2" />
              <span className="text-sm truncate flex-1 dark:text-slate-300">{file.name}</span>
              <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center text-sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              {success}
            </div>
          )}
        </div>

        {/* Preview */}
        {previewData.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg dark:text-white">
                数据预览 <span className="text-sm font-normal text-slate-500">({previewData.length} 条)</span>
              </h2>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                {loading ? '上传中...' : '确认上传'}
              </button>
            </div>
            
            <div className="overflow-x-auto max-h-[60vh]">
              <table className="w-full text-sm text-left relative">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 dark:text-slate-400 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3">昵称</th>
                    <th className="px-4 py-3">对局</th>
                    <th className="px-4 py-3">一位</th>
                    <th className="px-4 py-3">二位</th>
                    <th className="px-4 py-3">三位</th>
                    <th className="px-4 py-3">四位</th>
                    <th className="px-4 py-3">被飞</th>
                    <th className="px-4 py-3">总分</th>
                    <th className="px-4 py-3">PT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {(showAllPreview ? previewData : previewData.slice(0, 5)).map((row, i) => (
                    <tr key={i} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3 font-medium dark:text-white flex items-center gap-2">
                        {row.avatar && (
                          <img src={row.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        )}
                        <span>{row.name}</span>
                      </td>
                      <td className="px-4 py-3 dark:text-slate-300">{row.games}</td>
                      <td className="px-4 py-3 dark:text-slate-300">{row.first}</td>
                      <td className="px-4 py-3 dark:text-slate-300">{row.second}</td>
                      <td className="px-4 py-3 dark:text-slate-300">{row.third}</td>
                      <td className="px-4 py-3 dark:text-slate-300">{row.fourth}</td>
                      <td className="px-4 py-3 dark:text-slate-300">{row.bifei}</td>
                      <td className="px-4 py-3 dark:text-slate-300">{row.total}</td>
                      <td className={`px-4 py-3 font-bold ${row.pt >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {row.pt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {!showAllPreview && previewData.length > 5 && (
              <div className="text-center mt-4">
                <button 
                  onClick={() => setShowAllPreview(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
                >
                  查看全部数据 ({previewData.length} 条)
                </button>
              </div>
            )}
            
            {showAllPreview && (
              <div className="text-center mt-4">
                 <button 
                  onClick={() => setShowAllPreview(false)}
                  className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium"
                >
                  收起数据
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
