import { Match, HistoricalMatch } from '../types';

export const SUPPORTED_FREE_LEAGUES = ['PL', 'PD', 'BL1', 'DED', 'PPL'];

export const fetchFixturesFromApi = async (leagueId: string): Promise<Match[]> => {
  const response = await fetch(`/api/fixtures?leagueId=${leagueId}&provider=football-data`);
  const data = await response.json();
  return data.matches.slice(0, 10).map((m: any) => ({
    id: m.id,
    utcDate: m.utcDate,
    status: m.status,
    homeTeam: { id: m.homeTeam.id, name: m.homeTeam.name, logo: m.homeTeam.crest },
    awayTeam: { id: m.awayTeam.id, name: m.awayTeam.name, logo: m.awayTeam.crest },
    leagueId: leagueId
  }));
};

export const fetchResultsFromApi = async (leagueId: string): Promise<HistoricalMatch[]> => {
  const response = await fetch(`/api/fixtures?leagueId=${leagueId}&provider=football-data`);
  const data = await response.json();
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
