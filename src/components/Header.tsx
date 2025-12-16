import React from 'react';
import { Menu, Moon, Sun, Cpu } from 'lucide-react';
import tihoLogo from '../assets/tiho_logo.png';

export type Theme = 'light' | 'dark' | 'cyberpunk';

interface HeaderProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel transition-all duration-300">
      <div className="max-w-2xl mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={tihoLogo} alt="Riichi.Pro" className="h-10" />
          <div>
            <h1 className="text-lg font-extrabold tracking-tighter text-slate-900 dark:text-white italic uppercase leading-none transition-colors brand-neon">
              TIHO Riichi<span className="text-indigo-600 dark:text-indigo-400">.Pro</span>
            </h1>
            <p className="text-[10px] font-mono tracking-widest uppercase gradient-text-run">天和雀庄-联赛数据</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
            <button 
                onClick={cycleTheme}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-white transition-all"
                title={`当前主题: ${theme}`}
            >
                {getThemeIcon()}
            </button>
            <button className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white transition-colors">
                <Menu className="h-6 w-6" />
            </button>
        </div>
      </div>
    </header>
  );
};
