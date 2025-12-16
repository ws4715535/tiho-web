import { useState, useEffect } from 'react';
import { Header, Theme } from './components/Header';
import { RankList } from './components/RankList';

export default function App() {
  // Theme State (Global UI State)
  const [theme, setTheme] = useState<Theme>('dark');

  // Toggle Theme Class on Body
  useEffect(() => {
    const root = document.documentElement;
    // Reset all
    root.classList.remove('dark', 'cyberpunk');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'cyberpunk') {
      root.classList.add('dark', 'cyberpunk');
    }
  }, [theme]);

  return (
    <div className="min-h-screen pb-12 transition-colors duration-300">
      <Header theme={theme} setTheme={setTheme} />
      
      {/* Main Layout Container */}
      <main className="pt-20 px-4 max-w-2xl mx-auto">
        <RankList />
      </main>
    </div>
  );
}
