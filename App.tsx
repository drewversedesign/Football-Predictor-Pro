
import React, { useState, useMemo, useEffect } from 'react';
import { MatchPredictor } from './components/MatchPredictor';
import { BacktestDashboard } from './components/BacktestDashboard';
import { Sidebar } from './components/Sidebar';
import { LeagueAnalytics } from './components/LeagueAnalytics';
import { MyPredictions } from './components/MyPredictions';
import { ExpertFeed } from './components/ExpertFeed';
import { SettingsView } from './components/SettingsView';
import { LEAGUES, MOCK_TEAMS, MOCK_MATCHES } from './constants';
import { Match, TeamStats, HistoricalMatch, AppView } from './types';
import { fetchLiveTeamStats, fetchLiveFixtures, fetchHistoricalResults } from './services/geminiService';
import { fetchFixturesFromApi, fetchResultsFromApi, SUPPORTED_FREE_LEAGUES } from './services/footballDataService';
import { fetchFixturesFromApiFootball, fetchResultsFromApiFootball } from './services/apiFootballService';

const App: React.FC = () => {
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>(LEAGUES[0].id);
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [historicalMatches, setHistoricalMatches] = useState<HistoricalMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [customStats, setCustomStats] = useState<Record<number, TeamStats>>(MOCK_TEAMS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFetchingFixtures, setIsFetchingFixtures] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('PREDICT');
  const [error, setError] = useState<string | null>(null);

  const filteredMatches = useMemo(() => {
    return matches.filter(m => m.leagueId === selectedLeagueId);
  }, [selectedLeagueId, matches]);

  useEffect(() => {
    if (!selectedMatch || selectedMatch.leagueId !== selectedLeagueId) {
      setSelectedMatch(filteredMatches[0] || null);
    }
  }, [selectedLeagueId, filteredMatches]);

  /**
   * Universal match state updater. 
   * Filters out existing matches for the target league and adds new ones.
   * Ensures no duplicate match IDs across the entire application state.
   */
  const updateLeagueMatches = (leagueId: string, newMatches: Match[]) => {
    setMatches(prev => {
      const filtered = prev.filter(m => m.leagueId !== leagueId);
      // Extra safety: Filter out any duplicates by ID if multiple sources were accidentally merged
      const uniqueNew = newMatches.filter(
        (m, index, self) => index === self.findIndex((t) => t.id === m.id)
      );
      return [...filtered, ...uniqueNew];
    });
  };

  const handleRefreshFixtures = async () => {
    const league = LEAGUES.find(l => l.id === selectedLeagueId);
    if (!league) return;
    
    setIsFetchingFixtures(true);
    setError(null);
    
    let liveFixtures: Match[] = [];
    const apiFootballKey = localStorage.getItem('API_FOOTBALL_KEY');
    const footballDataKey = localStorage.getItem('FOOTBALL_API_KEY') || process.env.FOOTBALL_API_KEY;

    try {
      // --- WATERFALL FALLBACK STRATEGY ---
      
      // Attempt 1: API-Football (Highest Priority)
      if (apiFootballKey) {
        try {
          liveFixtures = await fetchFixturesFromApiFootball(league.id);
          console.log(`[ENGINE] ${league.id} Fixtures: Sync via API-Football successful.`);
        } catch (e) {
          console.warn("[ENGINE] API-Football failed, attempting secondary provider...", e);
        }
      }

      // Attempt 2: Football-Data.org (Fallback A)
      if (liveFixtures.length === 0 && SUPPORTED_FREE_LEAGUES.includes(league.id) && footballDataKey) {
        try {
          liveFixtures = await fetchFixturesFromApi(league.id);
          console.log(`[ENGINE] ${league.id} Fixtures: Sync via Football-Data.org successful.`);
        } catch (e) {
          console.warn("[ENGINE] Football-Data.org service down or error, attempting AI grounding...", e);
        }
      }

      // Attempt 3: Gemini Search Grounding (Fallback B / Last Resort)
      if (liveFixtures.length === 0) {
        try {
          console.log(`[ENGINE] ${league.id} Fixtures: Deploying Gemini Search Fallback...`);
          liveFixtures = await fetchLiveFixtures(league.name, league.id);
        } catch (e) {
          console.error("[ENGINE] Critical Error: All fixture providers failed.", e);
        }
      }

      if (liveFixtures.length > 0) {
        updateLeagueMatches(selectedLeagueId, liveFixtures);
      } else {
        setError("Unable to retrieve schedule for this league. System offline.");
      }
    } catch (err: any) {
      console.error(err);
      setError("An unexpected synchronization error occurred.");
    } finally {
      setIsFetchingFixtures(false);
    }
  };

  const handleFetchHistory = async () => {
    const league = LEAGUES.find(l => l.id === selectedLeagueId);
    if (!league) return;
    
    setIsFetchingHistory(true);
    setError(null);

    let history: HistoricalMatch[] = [];
    const apiFootballKey = localStorage.getItem('API_FOOTBALL_KEY');
    const footballDataKey = localStorage.getItem('FOOTBALL_API_KEY') || process.env.FOOTBALL_API_KEY;

    try {
      // --- WATERFALL FALLBACK STRATEGY ---
      
      // Attempt 1: API-Football
      if (apiFootballKey) {
        try {
          history = await fetchResultsFromApiFootball(league.id);
          console.log(`[BACKTEST] ${league.id} Results: Sync via API-Football successful.`);
        } catch (e) {
          console.warn("[BACKTEST] API-Football history fetch failed");
        }
      }

      // Attempt 2: Football-Data.org
      if (history.length === 0 && SUPPORTED_FREE_LEAGUES.includes(league.id) && footballDataKey) {
        try {
          history = await fetchResultsFromApi(league.id);
          console.log(`[BACKTEST] ${league.id} Results: Sync via Football-Data.org successful.`);
        } catch (e) {
          console.warn("[BACKTEST] Football-Data.org results fetch failed or service down");
        }
      }

      // Attempt 3: Gemini Fallback
      if (history.length === 0) {
        try {
          console.log(`[BACKTEST] ${league.id} Results: Deploying Gemini Search Fallback...`);
          history = await fetchHistoricalResults(league.name, league.id);
        } catch (e) {
          console.error("[BACKTEST] Critical Error: All historical providers failed.");
        }
      }
      
      if (history.length > 0) {
        setHistoricalMatches(history);
        setCurrentView('BACKTEST');
      } else {
        setError("League analytics unavailable. Provider connection timeout.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Backtest center synchronization failed.");
    } finally {
      setIsFetchingHistory(false);
    }
  };

  const handleLiveSync = async () => {
    if (!selectedMatch) return;
    setIsSyncing(true);
    setError(null);

    try {
      const [h, a] = await Promise.all([
        fetchLiveTeamStats(selectedMatch.homeTeam.name),
        fetchLiveTeamStats(selectedMatch.awayTeam.name)
      ]);
      if (h || a) {
        setCustomStats(prev => ({
          ...prev,
          [selectedMatch.homeTeam.id]: { ...(prev[selectedMatch.homeTeam.id] || MOCK_TEAMS[1]), ...h, name: selectedMatch.homeTeam.name },
          [selectedMatch.awayTeam.id]: { ...(prev[selectedMatch.awayTeam.id] || MOCK_TEAMS[2]), ...a, name: selectedMatch.awayTeam.name }
        }));
      }
    } catch (err: any) {
      console.error(err);
      setError("Tactical intelligence scan failed.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-500">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />

      <div className="flex-1 flex flex-col">
        {/* Header Strip for League Switching */}
        <div className="bg-slate-800/20 border-b border-slate-700/50 sticky top-0 z-20 backdrop-blur-md px-6 py-3 flex items-center gap-6 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">Market Selector</span>
          <div className="flex items-center gap-1">
            {LEAGUES.map(league => (
              <button
                key={league.id}
                onClick={() => { setSelectedLeagueId(league.id); setHistoricalMatches([]); setError(null); }}
                className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedLeagueId === league.id 
                    ? 'bg-slate-700 text-emerald-400 shadow-lg' 
                    : 'text-slate-500 hover:text-white'
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>
          
          <div className="ml-auto hidden xl:flex items-center gap-4">
            <button 
              onClick={handleFetchHistory}
              disabled={isFetchingHistory}
              className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all flex items-center gap-2"
            >
              {isFetchingHistory ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              Run League Backtest
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3">
             <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{error}</p>
             <button onClick={() => setError(null)} className="ml-auto text-slate-500 hover:text-white"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        )}

        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {currentView === 'PREDICT' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <aside className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-slate-400 uppercase text-[10px] font-black tracking-widest">Fixtures</h2>
                  <button onClick={handleRefreshFixtures} disabled={isFetchingFixtures} className="text-[10px] bg-slate-800 text-emerald-400 px-3 py-1 rounded-md font-bold uppercase tracking-tighter border border-slate-700 flex items-center gap-2">
                    {isFetchingFixtures ? <div className="w-3 h-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /> : 'Refresh'}
                  </button>
                </div>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
                  {filteredMatches.length > 0 ? filteredMatches.map(match => (
                    <button key={match.id} onClick={() => { setSelectedMatch(match); setCurrentView('PREDICT'); setError(null); }} className={`w-full text-left p-4 rounded-2xl transition-all border group relative overflow-hidden ${selectedMatch?.id === match.id ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg' : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${selectedMatch?.id === match.id ? 'bg-emerald-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>{match.status}</span>
                        <span className={`text-[10px] font-bold ${selectedMatch?.id === match.id ? 'text-emerald-400' : 'text-slate-500'}`}>{new Date(match.utcDate).toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col items-center gap-2 flex-1">
                          <img src={match.homeTeam.logo} alt="" className="w-10 h-10 object-contain rounded-full bg-slate-900/50 p-1" />
                          <span className={`text-[10px] font-black text-center truncate w-full ${selectedMatch?.id === match.id ? 'text-white' : 'text-slate-400'}`}>{match.homeTeam.name}</span>
                        </div>
                        <div className="text-[10px] font-black text-slate-800">VS</div>
                        <div className="flex flex-col items-center gap-2 flex-1">
                          <img src={match.awayTeam.logo} alt="" className="w-10 h-10 object-contain rounded-full bg-slate-900/50 p-1" />
                          <span className={`text-[10px] font-black text-center truncate w-full ${selectedMatch?.id === match.id ? 'text-white' : 'text-slate-400'}`}>{match.awayTeam.name}</span>
                        </div>
                      </div>
                    </button>
                  )) : (
                    <div className="text-center py-10 bg-slate-800/20 rounded-2xl border border-slate-700/50">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No fixtures available</p>
                    </div>
                  )}
                </div>
              </aside>

              <div className="lg:col-span-8">
                {selectedMatch ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-black text-white flex items-center gap-3">Match Prediction</h2>
                      <button onClick={handleLiveSync} disabled={isSyncing} className={`flex items-center gap-2 text-[10px] font-black tracking-widest px-4 py-2 rounded-xl border ${isSyncing ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'}`}>
                        {isSyncing ? <div className="w-3 h-3 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" /> : null}
                        AI Tactical Scan
                      </button>
                    </div>
import { ValueBetFinder } from './components/ValueBetFinder';
                    <MatchPredictor match={selectedMatch} customStats={customStats} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-800/10 rounded-[32px] border-2 border-dashed border-slate-800 min-h-[500px]">
                    <p className="font-black text-lg text-slate-700 uppercase tracking-widest">Select a Match</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'BACKTEST' && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                League Backtest Center
                <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-1 rounded font-black uppercase tracking-widest italic">Historical Accuracy</span>
              </h2>
              <BacktestDashboard 
                historicalMatches={historicalMatches} 
                league={LEAGUES.find(l => l.id === selectedLeagueId)!} 
                customStats={customStats} 
              />
            </div>
          )}

{currentView === 'FEED' && <ExpertFeed />}
{currentView === 'MY_PREDICTIONS' && <MyPredictions />}
          {currentView === 'LEAGUE_ANALYTICS' && (
            <LeagueAnalytics leagues={LEAGUES} />
          )}

          {currentView === 'SETTINGS' && (
            <SettingsView />
          )}
        </main>

        <footer className="mt-auto px-10 py-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 font-bold uppercase text-[10px] tracking-widest">
          <p>&copy; 2025 StatKick Pro Engine. Multi-Provider Hybrid Data.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> API-Football</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Football-Data</span>
            <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Gemini AI</span>
          </div>
        </footer>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;
