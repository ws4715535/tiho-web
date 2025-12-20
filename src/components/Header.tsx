import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, Cpu, Upload, Lock, Database } from 'lucide-react';
import { Button } from './ui/Button';
import tihoLogo from '../assets/tiho_logo.png';

export type Theme = 'light' | 'dark' | 'cyberpunk';

interface HeaderProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Password Modal State
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  const [pwdInput, setPwdInput] = useState('');
  const [pwdError, setPwdError] = useState(false);
  const [targetPath, setTargetPath] = useState('/admin/upload');
  
  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('cyberpunk');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    switch(theme) {
      case 'light': return <Sun className="h-5 w-5" />;
      case 'dark': return <Moon className="h-5 w-5" />;
      case 'cyberpunk': return <Cpu className="h-5 w-5 text-[#00e0ff]" />;
    }
  };

  const handleAdminClick = (path: string) => {
    setIsMenuOpen(false);
    setTargetPath(path);
    setIsPwdModalOpen(true);
    setPwdInput('');
    setPwdError(false);
  };

  const handlePwdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdInput === 'tiantian') {
      setIsPwdModalOpen(false);
      navigate(targetPath);
    } else {
      setPwdError(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel transition-all duration-300">
        <div className="max-w-2xl mx-auto px-4 h-16 flex justify-between items-center">
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src={tihoLogo} alt="Riichi.Pro" className="h-10" />
            <div>
              <h1 className="text-lg font-extrabold tracking-tighter text-slate-900 dark:text-white italic uppercase leading-none transition-colors brand-neon">
                TIHO Riichi<span className="text-indigo-600 dark:text-indigo-400">.Pro</span>
              </h1>
              <p className="text-[10px] font-mono tracking-widest uppercase gradient-text-run">天和雀庄-联赛数据</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 relative">
              <button 
                  onClick={cycleTheme}
                  className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white transition-all"
                  title={`当前主题: ${theme}`}
              >
                  {getThemeIcon()}
              </button>
              <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                  <Menu className="h-6 w-6" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                  <>
                      <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setIsMenuOpen(false)}
                      ></div>
                      <div className="absolute top-12 right-0 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                          <button
                              onClick={() => handleAdminClick('/admin/upload')}
                              className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center transition-colors"
                          >
                              <Upload className="h-4 w-4 mr-2" />
                              上传成绩数据
                          </button>
                          <button
                              onClick={() => handleAdminClick('/admin/manage')}
                              className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center transition-colors border-t border-slate-100 dark:border-slate-700"
                          >
                              <Database className="h-4 w-4 mr-2" />
                              管理成绩数据
                          </button>
                      </div>
                  </>
              )}
          </div>
        </div>
      </header>

      {/* Password Modal */}
      {isPwdModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-700 scale-100 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">管理员验证</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">请输入密钥以继续操作</p>
                </div>
              </div>
              
              <form onSubmit={handlePwdSubmit}>
                  <input
                    type="password"
                    value={pwdInput}
                    onChange={(e) => { setPwdInput(e.target.value); setPwdError(false); }}
                    className="w-full px-4 py-3 border rounded-lg bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-400"
                    placeholder="在此输入密钥..."
                    autoFocus
                  />
                  
                  {pwdError && (
                    <p className="text-red-500 text-xs mt-2 animate-in slide-in-from-left-1">
                      密钥错误，请重试
                    </p>
                  )}
                  
                  <div className="flex justify-end space-x-3 mt-6">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => setIsPwdModalOpen(false)}
                      >
                        取消
                      </Button>
                      <Button type="submit">
                        确认
                      </Button>
                  </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
