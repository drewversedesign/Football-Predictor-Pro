
import { Match, TeamStats, HistoricalMatch } from '../types';

const BASE_URL = 'https://api.football-data.org/v4';

const getApiKey = () => localStorage.getItem('FOOTBALL_API_KEY') || process.env.FOOTBALL_API_KEY;

/**
 * Supported leagues in football-data.org Free Tier:
 * PL, ELC, CL, EC, SA, FL1, BL1, DED, PPL, PD, CLI, BSA
 */
export const SUPPORTED_FREE_LEAGUES = ['PL', 'PD', 'BL1', 'DED', 'PPL'];

const fetchWithAuth = async (endpoint: string) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Football Data API Key is not configured. Go to Settings to add one.');
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'X-Auth-Token': apiKey }
  });

  if (!response.ok) {
    if (response.status === 429) throw new Error('API Rate limit reached.');
    if (response.status === 403) throw new Error('API Key invalid or restricted for this league.');
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};

export const fetchFixturesFromApi = async (leagueId: string): Promise<Match[]> => {
  const data = await fetchWithAuth(`/competitions/${leagueId}/matches?status=SCHEDULED`);
  return data.matches.slice(0, 10).map((m: any) => ({
    id: m.id,
    utcDate: m.utcDate,
    status: m.status,
    homeTeam: { 
      id: m.homeTeam.id, 
      name: m.homeTeam.name, 
      logo: m.homeTeam.crest 
    },
    awayTeam: { 
      id: m.awayTeam.id, 
      name: m.awayTeam.name, 
      logo: m.awayTeam.crest 
    },
    leagueId: leagueId
  }));
};

export const fetchResultsFromApi = async (leagueId: string): Promise<HistoricalMatch[]> => {
  const data = await fetchWithAuth(`/competitions/${leagueId}/matches?status=FINISHED`);
  // Get last 5 finished matches
  return data.matches.slice(-5).map((m: any) => ({
    id: m.id,
    utcDate: m.utcDate,
    status: m.status,
    homeGoals: m.score.fullTime.home,
    awayGoals: m.score.fullTime.away,
    homeTeam: { id: m.homeTeam.id, name: m.homeTeam.name, logo: m.homeTeam.crest },
    awayTeam: { id: m.awayTeam.id, name: m.awayTeam.name, logo: m.awayTeam.crest },
    leagueId: leagueId
  }));
};

export const fetchTeamStatsFromApi = async (teamId: number): Promise<Partial<TeamStats>> => {
  const data = await fetchWithAuth(`/teams/${teamId}`);
  return {
    name: data.name,
    shortName: data.tla,
    logo: data.crest
  };
};
