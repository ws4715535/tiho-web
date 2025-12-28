import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle, QrCode, Upload } from 'lucide-react';
import { fetchCommunitySettings, updateCommunitySettings, uploadCommunityQR, CommunitySettings } from '../services/communityService';
import { Button } from '../components/ui/Button';

export const AdminCommunity = () => {
  const navigate = useNavigate();
  
  const [communityLoading, setCommunityLoading] = useState(false);
  const [communitySaving, setCommunitySaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [communityForm, setCommunityForm] = useState<Partial<CommunitySettings>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCommunitySettings = async () => {
    setCommunityLoading(true);
    try {
      const settings = await fetchCommunitySettings();
      setCommunityForm(settings || {});
    } catch (err) {
      console.error(err);
      setError('加载社区配置失败');
    } finally {
      setCommunityLoading(false);
    }
  };

  const saveCommunitySettings = async () => {
    setCommunitySaving(true);
    setError('');
    setSuccess('');
    try {
      await updateCommunitySettings(communityForm);
      setSuccess('社区配置已保存');
      await loadCommunitySettings(); // Reload to get fresh state
    } catch (err) {
      console.error(err);
      setError('保存配置失败');
    } finally {
      setCommunitySaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    setError('');
    try {
      const publicUrl = await uploadCommunityQR(file);
      setCommunityForm(prev => ({
        ...prev,
        group_qr_code: publicUrl
      }));
      setSuccess('图片上传成功，请记得点击保存配置');
    } catch (err) {
      console.error(err);
      setError('图片上传失败: ' + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    loadCommunitySettings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
                onClick={() => navigate('/admin')}
                className="p-2 mr-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
                <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">社群配置管理</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Global Messages */}
        {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center text-sm animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
        )}
        {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg flex items-center text-sm animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="h-4 w-4 mr-2" />
              {success}
            </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <QrCode className="w-6 h-6 text-indigo-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">联系方式与群二维码配置</h2>
            </div>

            {communityLoading ? (
                <div className="py-12 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="space-y-6 max-w-lg">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            联系人姓名
                        </label>
                        <input 
                            type="text"
                            value={communityForm.contact_name || ''}
                            onChange={e => setCommunityForm(prev => ({...prev, contact_name: e.target.value}))}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="例如: 张三"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            官方微信号
                        </label>
                        <input 
                            type="text"
                            value={communityForm.contact_wechat || ''}
                            onChange={e => setCommunityForm(prev => ({...prev, contact_wechat: e.target.value}))}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="例如: TihoAdmin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            联系电话
                        </label>
                        <input 
                            type="text"
                            value={communityForm.contact_phone || ''}
                            onChange={e => setCommunityForm(prev => ({...prev, contact_phone: e.target.value}))}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="例如: 13800000000"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            群二维码图片
                        </label>
                        
                        <div className="flex flex-col gap-4">
                            {/* File Upload Button */}
                            <div className="relative">
                                <input
                                    type="file"
                                    id="qr-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                                <label 
                                    htmlFor="qr-upload"
                                    className={`flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            上传中...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            点击上传图片
                                        </>
                                    )}
                                </label>
                            </div>

                            {/* Manual URL Input Fallback */}
                            <input 
                                type="url"
                                value={communityForm.group_qr_code || ''}
                                onChange={e => setCommunityForm(prev => ({...prev, group_qr_code: e.target.value}))}
                                className="w-full px-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-500"
                                placeholder="或直接输入图片 URL"
                            />
                        </div>

                        {communityForm.group_qr_code && (
                            <div className="mt-4 p-4 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900/30 flex justify-center relative group">
                                <img 
                                    src={communityForm.group_qr_code} 
                                    alt="Preview" 
                                    className="max-w-[200px] max-h-[200px] object-contain rounded-lg shadow-sm"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button 
                            onClick={saveCommunitySettings} 
                            disabled={communitySaving}
                            className="w-full sm:w-auto"
                        >
                            {communitySaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    保存中...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    保存配置
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
