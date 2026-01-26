import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Search, Loader2, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchAllTeams, PairedTeam } from '../services/teamService';

export const TeamList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState<PairedTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetchAllTeams();
        setTeams(data);
      } catch (err) {
        console.error('Failed to load teams:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTeams();
  }, []);

  const filteredTeams = teams
    .filter(team => 
        team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.member_1_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.member_2_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
        // Sort by created_at ascending (oldest first)
        // If created_at is missing, treat as oldest (or newest depending on preference, here oldest)
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 animate-in fade-in duration-500">
      {/* Navigation Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg text-slate-900 dark:text-white">已报名战队</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索战队或队员..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all shadow-sm"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between px-2 text-xs text-slate-500 dark:text-slate-400">
          <span>共 {teams.length} 支战队报名</span>
          {/* <span>按积分排序</span> */}
        </div>

        {/* Team List Grid */}
        {loading ? (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTeams.map(team => (
                <div key={team.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                <img 
                    src={team.avatar_url || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + team.id} 
                    alt={team.team_name} 
                    className="w-14 h-14 rounded-xl object-cover border border-slate-100 dark:border-slate-600" 
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate mb-1">{team.team_name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{team.member_1_name}</span>
                    </div>
                    <span>&</span>
                    <span>{team.member_2_name}</span>
                    </div>
                    {team.created_at && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                            <Calendar className="w-3 h-3" />
                            <span>成立时间: {new Date(team.created_at).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
                </div>
            ))}

            {filteredTeams.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                <p>未找到匹配的战队</p>
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};
