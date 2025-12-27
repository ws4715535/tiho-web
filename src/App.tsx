import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header, Theme } from './components/Header';
import { RankList } from './components/RankList';
import { Home } from './pages/Home';
import { MoMo } from './pages/MoMo';
import AdminLayout from './pages/AdminLayout';
import { TeamMatchIntro } from './pages/TeamMatchIntro';
import { MatchIntro } from './pages/MatchIntro';
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
    <div className="min-h-screen transition-colors duration-300">
      <Routes>
        {/* Admin Routes - Full Width */}
        <Route path="/admin/*" element={<AdminLayout />} />

        {/* Public Routes - Constrained Width & With Header */}
        <Route path="*" element={
          <>
            <Header theme={theme} setTheme={setTheme} />
            <main className="pt-20 px-4 max-w-2xl mx-auto pb-12">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/momo" element={<MoMo />} />
                <Route path="/match" element={<Navigate to="/momo" replace />} />
                <Route path="/ranking" element={<RankList />} />
                <Route path="/team-intro" element={<TeamMatchIntro />} />
                <Route path="/individual-intro" element={<IndividualMatchIntro />} />
                <Route path="/tournament/:id" element={<MatchIntro />} />
                <Route path="/team-list" element={<TeamList />} />
              </Routes>
            </main>
          </>
        } />
      </Routes>
    </div>
  );
}
