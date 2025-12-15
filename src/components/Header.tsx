import React from 'react';
import { Menu, Zap, Moon, Sun, Cpu, Trees } from 'lucide-react';

export type Theme = 'light' | 'dark' | 'cyberpunk' | 'forest';

interface HeaderProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, setTheme }) => {
  
  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('cyberpunk');
    else if (theme === 'cyberpunk') setTheme('forest');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    switch(theme) {
      case 'light': return <Sun className="h-5 w-5" />;
      case 'dark': return <Moon className="h-5 w-5" />;
      case 'cyberpunk': return <Cpu className="h-5 w-5 text-[#00e0ff]" />;
      case 'forest': return <Trees className="h-5 w-5 text-emerald-400" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel transition-all duration-300">
      <div className="max-w-2xl mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg shadow-md transition-colors duration-300 ${
              theme === 'cyberpunk' 
                ? 'bg-[#00e0ff] shadow-[0_0_10px_rgba(0,224,255,0.6)]' 
                : theme === 'forest'
                ? 'bg-emerald-600 shadow-emerald-500/20'
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20 dark:shadow-[0_0_15px_rgba(99,102,241,0.5)]'
          }`}>
            <Zap className={`h-5 w-5 fill-current ${theme === 'cyberpunk' ? 'text-black' : 'text-white'}`} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tighter text-slate-900 dark:text-white italic uppercase leading-none transition-colors">
              Riichi<span className="text-indigo-600 dark:text-indigo-400">.Pro</span>
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-widest uppercase transition-colors">官方联赛数据</p>
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