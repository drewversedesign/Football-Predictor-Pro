import { Match, HistoricalMatch } from '../types';

export const fetchFixturesFromApiFootball = async (leagueId: string): Promise<Match[]> => {
  const response = await fetch(`/api/fixtures?leagueId=${leagueId}&provider=api-football`);
  const data = await response.json();
  return data.response.map((f: any) => ({
    id: f.fixture.id,
    utcDate: f.fixture.date,
    status: f.fixture.status.short,
    homeTeam: { id: f.teams.home.id, name: f.teams.home.name, logo: f.teams.home.logo },
    awayTeam: { id: f.teams.away.id, name: f.teams.away.name, logo: f.teams.away.logo },
    leagueId: leagueId
  }));
};

export const fetchResultsFromApiFootball = async (leagueId: string): Promise<HistoricalMatch[]> => {
  const response = await fetch(`/api/fixtures?leagueId=${leagueId}&provider=api-football`);
  const data = await response.json();
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
