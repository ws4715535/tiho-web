import { Users, MessagesSquare, CalendarDays, Award, ArrowLeft, QrCode, Phone, MessageCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useEffect, useState } from 'react';
import { fetchCommunitySettings, CommunitySettings } from '../services/communityService';

export const Community = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<CommunitySettings | null>(null);

  useEffect(() => {
    fetchCommunitySettings().then(setSettings);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            活跃社群
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Join Club Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-bl-full -mr-12 -mt-12 pointer-events-none"></div>
           
           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
             <QrCode className="w-6 h-6 text-emerald-500" />
             加入我们
           </h2>

           <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              {/* QR Code Area */}
              <div className="flex-shrink-0 text-center space-y-2">
                  <div className="w-48 h-48 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 overflow-hidden">
                      {settings?.group_qr_code ? (
                          <img src={settings.group_qr_code} alt="群二维码" className="w-full h-full object-cover" />
                      ) : (
                          <span className="text-slate-400 text-sm">暂无二维码</span>
                      )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                      扫码加入官方交流群
                  </p>
              </div>

              {/* Contact Info */}
              <div className="flex-grow space-y-6 pt-2 w-full">
                  <div className="space-y-4">
                      {settings?.contact_name && (
                          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                  <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                              </div>
                              <div>
                                  <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-0.5">联系人</div>
                                  <div className="text-lg font-bold text-slate-900 dark:text-white select-all">
                                      {settings.contact_name}
                                  </div>
                              </div>
                          </div>
                      )}

                      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                              <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-0.5">官方微信</div>
                              <div className="text-lg font-bold text-slate-900 dark:text-white select-all">
                                  {settings?.contact_wechat || '暂无配置'}
                              </div>
                          </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                              <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-0.5">联系电话</div>
                              <div className="text-lg font-bold text-slate-900 dark:text-white select-all">
                                  {settings?.contact_phone || '暂无配置'}
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/20 text-amber-800 dark:text-amber-200">
                      💡 如果群二维码已过期或无法扫码，请直接添加官方微信，备注“加入俱乐部”，管理员会邀请您入群。
                  </p>
              </div>
           </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
            <MessagesSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">雀友交流</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            加入 TIHO 官方社群，与数千名雀友实时交流心得、复盘对局、分享喜悦。无论您是萌新还是大佬，这里总有聊得来的伙伴。
          </p>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
            <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">定期活动</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            除了正式联赛，我们还会不定期举办娱乐赛、教学讲座、线下聚会等丰富多彩的活动，让大家在紧张的竞技之余，享受麻将带来的纯粹快乐。
          </p>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4">
            <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">荣誉体系</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            在社群中积极活跃或在比赛中表现优异的成员，将获得专属的头衔、徽章等荣誉标识，成为社群中的明星人物。
          </p>
        </section>
      </main>
    </div>
  );
};
