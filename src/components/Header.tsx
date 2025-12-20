import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Moon, Sun, Cpu, Upload } from 'lucide-react';
import tihoLogo from '../assets/tiho_logo.png';

export type Theme = 'light' | 'dark' | 'cyberpunk';

interface HeaderProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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

  const handleUploadClick = () => {
    setIsMenuOpen(false);
    // Simple Auth
    const pwd = prompt('请输入管理员密钥');
    if (pwd === 'tiantian') {
      navigate('/admin/upload');
    } else if (pwd !== null) {
      alert('密钥错误');
    }
  };

  return (
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
                            onClick={handleUploadClick}
                            className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center transition-colors"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            上传成绩数据
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>
    </header>
  );
};
