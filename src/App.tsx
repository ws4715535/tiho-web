import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header, Theme } from './components/Header';
import { RankList } from './components/RankList';
import { Home } from './pages/Home';
import { MoMo } from './pages/MoMo';
import { AdminUpload } from './pages/AdminUpload';
import { AdminManage } from './pages/AdminManage';
import { AdminTeamManager } from './pages/AdminTeamManager';
import { TeamMatchIntro } from './pages/TeamMatchIntro';
import { TeamList } from './pages/TeamList';
import { IndividualMatchIntro } from './pages/IndividualMatchIntro';

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
          <Route path="/momo" element={<MoMo />} />
          <Route path="/match" element={<Navigate to="/momo" replace />} />
          <Route path="/ranking" element={<RankList />} />
          <Route path="/admin/upload" element={<AdminUpload />} />
          <Route path="/admin/manage" element={<AdminManage />} />
          <Route path="/admin/teams" element={<AdminTeamManager />} />
          <Route path="/team-intro" element={<TeamMatchIntro />} />
          <Route path="/individual-intro" element={<IndividualMatchIntro />} />
          <Route path="/team-list" element={<TeamList />} />
        </Routes>
      </main>
    </div>
  );
}
