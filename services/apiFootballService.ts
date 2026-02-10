
import { Match, TeamStats, HistoricalMatch } from '../types';

const BASE_URL = 'https://v3.football.api-sports.io';

const getApiKey = () => localStorage.getItem('API_FOOTBALL_KEY');

const fetchWithAuth = async (endpoint: string) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API-Football Key is not configured in Settings.');
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'x-rapidapi-key': apiKey,
      'x-apisports-key': apiKey, // Supports both RapidAPI and Direct
    }
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const data = await response.json();
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(JSON.stringify(data.errors));
  }
  return data;
};

// Map our internal league IDs to API-Football IDs
const LEAGUE_MAP: Record<string, number> = {
  'PL': 39,
  'PD': 140,
  'BL1': 78,
  'DED': 88,
  'PPL': 94,
  'J1': 98,
  'ASV': 113,
  'CSL': 169
};

export const fetchFixturesFromApiFootball = async (leagueId: string): Promise<Match[]> => {
  const apiId = LEAGUE_MAP[leagueId];
  if (!apiId) throw new Error(`League ${leagueId} not mapped for API-Football.`);

  const data = await fetchWithAuth(`/fixtures?league=${apiId}&season=2024&next=10`);
  return data.response.map((f: any) => ({
    id: f.fixture.id,
    utcDate: f.fixture.date,
    status: f.fixture.status.short,
    homeTeam: { 
      id: f.teams.home.id, 
      name: f.teams.home.name, 
      logo: f.teams.home.logo 
    },
    awayTeam: { 
      id: f.teams.away.id, 
      name: f.teams.away.name, 
      logo: f.teams.away.logo 
    },
    leagueId: leagueId
  }));
};

export const fetchResultsFromApiFootball = async (leagueId: string): Promise<HistoricalMatch[]> => {
  const apiId = LEAGUE_MAP[leagueId];
  if (!apiId) throw new Error(`League ${leagueId} not mapped.`);

  const data = await fetchWithAuth(`/fixtures?league=${apiId}&season=2024&last=10`);
  return data.response.map((f: any) => ({
    id: f.fixture.id,
    utcDate: f.fixture.date,
    status: 'FINISHED',
    homeGoals: f.goals.home,
    awayGoals: f.goals.away,
    homeTeam: { id: f.teams.home.id, name: f.teams.home.name, logo: f.teams.home.logo },
    awayTeam: { id: f.teams.away.id, name: f.teams.away.name, logo: f.teams.away.logo },
    leagueId: leagueId
  }));
};
