import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  Database, 
  Users, 
  Trophy, 
  Menu, 
  LogOut,
  Home
} from 'lucide-react';
import { AdminUpload } from './AdminUpload';
import { AdminManage } from './AdminManage';
import { AdminTeamManager } from './AdminTeamManager';
import { AdminTournamentManager } from './AdminTournamentManager';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Check simple auth (using the same mechanism as Header)
  // In a real app, use a proper Auth Context
  useEffect(() => {
    // If we want to strictly protect this route, we could check a sessionStorage flag
    // set during the "tiantian" password check in Header.
    // For now, we assume if they reached here, they passed the check or typed URL.
    // Let's just keep it open for this demo or add a simple check if you like.
  }, []);

  const menuItems = [
    { path: '/admin', label: '仪表盘', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
    { path: '/admin/tournaments', label: '赛事配置', icon: <Trophy className="w-5 h-5" /> },
    { path: '/admin/teams', label: '战队管理', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/upload', label: '成绩上传', icon: <Upload className="w-5 h-5" /> },
    { path: '/admin/manage', label: '成绩管理', icon: <Database className="w-5 h-5" /> },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-700">
            <h1 className="text-xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">
              TIHO <span className="text-indigo-600 dark:text-indigo-400">ADMIN</span>
            </h1>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path, item.exact)
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>返回首页</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-slate-900">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-500">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-slate-900 dark:text-white">管理后台</span>
          <div className="w-6"></div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-full">
             <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/tournaments" element={<AdminTournamentManager />} />
                <Route path="/teams" element={<AdminTeamManager />} />
                <Route path="/upload" element={<AdminUpload />} />
                <Route path="/manage" element={<AdminManage />} />
             </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

// Simple Dashboard Home Component
const DashboardHome = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">欢迎回来，管理员</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">赛事管理</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">配置首页 Banner、赛事规则与详情。</p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-4">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">战队管理</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">管理参赛队伍信息、成员与积分。</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                        <Upload className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">数据录入</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">上传比赛日志或手动录入对局成绩。</p>
                </div>
            </div>
        </div>
    )
}

export default AdminLayout;
