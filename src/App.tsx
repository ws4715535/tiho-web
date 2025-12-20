import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header, Theme } from './components/Header';
import { RankList } from './components/RankList';
import { Home } from './pages/Home';
import { AdminUpload } from './pages/AdminUpload';
import { AdminManage } from './pages/AdminManage';

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ranking" element={<RankList />} />
          <Route path="/admin/upload" element={<AdminUpload />} />
          <Route path="/admin/manage" element={<AdminManage />} />
        </Routes>
      </main>
    </div>
  );
}
