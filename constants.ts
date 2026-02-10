
import { LeagueStats, TeamStats, Match } from './types';

export const LEAGUES: LeagueStats[] = [
  { 
    id: 'PL', 
    name: 'Premier League', 
    avgHomeGoals: 1.58, 
    avgAwayGoals: 1.26, 
    description: 'Massive data availability, High goal average, Strong home advantage. Note: More efficient odds, so value is smaller.',
    bestMarkets: ['Over goals', 'BTTS', 'Top-team wins']
  },
  { 
    id: 'PD', 
    name: 'La Liga', 
    avgHomeGoals: 1.45, 
    avgAwayGoals: 1.12, 
    description: 'Top teams are very consistent, Lower teams struggle against elite clubs, Tactically stable league.',
    bestMarkets: ['Favorites', 'Draw no bet', 'Under 3.5 goals']
  },
  { 
    id: 'BL1', 
    name: 'Bundesliga', 
    avgHomeGoals: 1.74, 
    avgAwayGoals: 1.43, 
    description: 'Very high goals per game, Strong gap between top and bottom teams, Attacking style is consistent every season.',
    bestMarkets: ['Over 2.5 goals', 'Favorites', 'BTTS']
  },
  { 
    id: 'DED', 
    name: 'Eredivisie', 
    avgHomeGoals: 1.85, 
    avgAwayGoals: 1.45, 
    description: 'One of the highest scoring leagues in Europe, Big teams dominate weak defenses, Upsets are rare at home for top clubs.',
    bestMarkets: ['Over goals', 'Handicap', 'Favorites']
  },
  { 
    id: 'PPL', 
    name: 'Primeira Liga', 
    avgHomeGoals: 1.40, 
    avgAwayGoals: 1.05, 
    description: 'Clear “big three” dominate the league, Small clubs rarely beat top teams, Low variance season to season.',
    bestMarkets: ['Home wins', 'Double chance', 'Under goals']
  },
  { 
    id: 'J1', 
    name: 'J1 League', 
    avgHomeGoals: 1.35, 
    avgAwayGoals: 1.25, 
    description: 'Very structured and disciplined play, Few surprise results, Stable scheduling and team behavior.',
    bestMarkets: ['Draw no bet', 'Under/over 2.5', 'Form-based bets']
  },
  { 
    id: 'ASV', 
    name: 'Allsvenskan', 
    avgHomeGoals: 1.55, 
    avgAwayGoals: 1.25, 
    description: 'Very low draw rate, Clear form streaks, Minimal mid-season disruption.',
    bestMarkets: ['Match winner', 'Double chance']
  },
  { 
    id: 'CSL', 
    name: 'Chinese Super League', 
    avgHomeGoals: 1.50, 
    avgAwayGoals: 1.10, 
    description: 'Very top-heavy league, Favorites win often, Models perform well historically.',
    bestMarkets: ['Favorites', 'Underdog fades', 'Under goals']
  },
];

export const MOCK_TEAMS: Record<number, TeamStats> = {
  // Premier League
  1: { id: 1, name: 'Arsenal', shortName: 'ARS', logo: 'https://crests.football-data.org/57.png', matchesPlayed: 25, goalsScored: 52, goalsConceded: 22, homeGoalsScored: 28, homeGoalsConceded: 10, homeMatches: 12, awayGoalsScored: 24, awayGoalsConceded: 12, awayMatches: 13, lastFive: ['W', 'W', 'W', 'L', 'W'] },
  2: { id: 2, name: 'Manchester City', shortName: 'MCI', logo: 'https://crests.football-data.org/65.png', matchesPlayed: 25, goalsScored: 58, goalsConceded: 25, homeGoalsScored: 32, homeGoalsConceded: 12, homeMatches: 13, awayGoalsScored: 26, awayGoalsConceded: 13, awayMatches: 12, lastFive: ['W', 'D', 'W', 'W', 'W'] },
  3: { id: 3, name: 'Liverpool', shortName: 'LIV', logo: 'https://crests.football-data.org/64.png', matchesPlayed: 25, goalsScored: 55, goalsConceded: 24, homeGoalsScored: 30, homeGoalsConceded: 11, homeMatches: 12, awayGoalsScored: 25, awayGoalsConceded: 13, awayMatches: 13, lastFive: ['W', 'W', 'L', 'W', 'W'] },
  4: { id: 4, name: 'Chelsea', shortName: 'CHE', logo: 'https://crests.football-data.org/61.png', matchesPlayed: 25, goalsScored: 38, goalsConceded: 35, homeGoalsScored: 20, homeGoalsConceded: 15, homeMatches: 12, awayGoalsScored: 18, awayGoalsConceded: 20, awayMatches: 13, lastFive: ['D', 'L', 'W', 'L', 'W'] },
  // La Liga
  5: { id: 5, name: 'Real Madrid', shortName: 'RMA', logo: 'https://crests.football-data.org/86.png', matchesPlayed: 24, goalsScored: 52, goalsConceded: 15, homeGoalsScored: 28, homeGoalsConceded: 7, homeMatches: 12, awayGoalsScored: 24, awayGoalsConceded: 8, awayMatches: 12, lastFive: ['W', 'W', 'W', 'W', 'D'] },
  6: { id: 6, name: 'Barcelona', shortName: 'FCB', logo: 'https://crests.football-data.org/81.png', matchesPlayed: 24, goalsScored: 50, goalsConceded: 33, homeGoalsScored: 25, homeGoalsConceded: 14, homeMatches: 12, awayGoalsScored: 25, awayGoalsConceded: 19, awayMatches: 12, lastFive: ['W', 'W', 'D', 'W', 'L'] },
  // Bundesliga
  7: { id: 7, name: 'Bayer Leverkusen', shortName: 'B04', logo: 'https://crests.football-data.org/3.png', matchesPlayed: 22, goalsScored: 57, goalsConceded: 15, homeGoalsScored: 30, homeGoalsConceded: 6, homeMatches: 11, awayGoalsScored: 27, awayGoalsConceded: 9, awayMatches: 11, lastFive: ['W', 'W', 'W', 'W', 'W'] },
  8: { id: 8, name: 'Bayern Munich', shortName: 'FCB', logo: 'https://crests.football-data.org/5.png', matchesPlayed: 22, goalsScored: 61, goalsConceded: 25, homeGoalsScored: 35, homeGoalsConceded: 7, homeMatches: 11, awayGoalsScored: 26, awayGoalsConceded: 18, awayMatches: 11, lastFive: ['L', 'L', 'W', 'W', 'W'] },
  // Eredivisie
  9: { id: 9, name: 'PSV Eindhoven', shortName: 'PSV', logo: 'https://crests.football-data.org/674.png', matchesPlayed: 22, goalsScored: 70, goalsConceded: 10, homeGoalsScored: 35, homeGoalsConceded: 4, homeMatches: 11, awayGoalsScored: 35, awayGoalsConceded: 6, awayMatches: 11, lastFive: ['W', 'W', 'D', 'W', 'W'] },
  10: { id: 10, name: 'Ajax', shortName: 'AJA', logo: 'https://crests.football-data.org/678.png', matchesPlayed: 22, goalsScored: 51, goalsConceded: 39, homeGoalsScored: 28, homeGoalsConceded: 18, homeMatches: 11, awayGoalsScored: 23, awayGoalsConceded: 21, awayMatches: 11, lastFive: ['L', 'D', 'W', 'L', 'W'] },
  // Primeira Liga
  11: { id: 11, name: 'Benfica', shortName: 'SLB', logo: 'https://crests.football-data.org/1903.png', matchesPlayed: 22, goalsScored: 52, goalsConceded: 15, homeGoalsScored: 29, homeGoalsConceded: 5, homeMatches: 11, awayGoalsScored: 23, awayGoalsConceded: 10, awayMatches: 11, lastFive: ['W', 'W', 'W', 'D', 'W'] },
  12: { id: 12, name: 'FC Porto', shortName: 'FCP', logo: 'https://crests.football-data.org/503.png', matchesPlayed: 22, goalsScored: 37, goalsConceded: 16, homeGoalsScored: 20, homeGoalsConceded: 5, homeMatches: 11, awayGoalsScored: 17, awayGoalsConceded: 11, awayMatches: 11, lastFive: ['W', 'L', 'D', 'W', 'W'] },
  // J1 League
  13: { id: 13, name: 'Vissel Kobe', shortName: 'KOB', logo: 'https://crests.football-data.org/5650.png', matchesPlayed: 34, goalsScored: 60, goalsConceded: 29, homeGoalsScored: 32, homeGoalsConceded: 15, homeMatches: 17, awayGoalsScored: 28, awayGoalsConceded: 14, awayMatches: 17, lastFive: ['W', 'W', 'W', 'W', 'D'] },
  14: { id: 14, name: 'Yokohama F. Marinos', shortName: 'MAR', logo: 'https://crests.football-data.org/5653.png', matchesPlayed: 34, goalsScored: 63, goalsConceded: 40, homeGoalsScored: 35, homeGoalsConceded: 18, homeMatches: 17, awayGoalsScored: 28, awayGoalsConceded: 22, awayMatches: 17, lastFive: ['L', 'W', 'D', 'W', 'W'] },
  // Allsvenskan
  15: { id: 15, name: 'Malmo FF', shortName: 'MAL', logo: 'https://crests.football-data.org/343.png', matchesPlayed: 30, goalsScored: 62, goalsConceded: 27, homeGoalsScored: 38, homeGoalsConceded: 10, homeMatches: 15, awayGoalsScored: 24, awayGoalsConceded: 17, awayMatches: 15, lastFive: ['W', 'L', 'W', 'D', 'W'] },
  16: { id: 16, name: 'Djurgardens IF', shortName: 'DJU', logo: 'https://crests.football-data.org/341.png', matchesPlayed: 30, goalsScored: 41, goalsConceded: 36, homeGoalsScored: 25, homeGoalsConceded: 14, homeMatches: 15, awayGoalsScored: 16, awayGoalsConceded: 22, awayMatches: 15, lastFive: ['L', 'W', 'L', 'W', 'D'] },
  // Chinese Super League
  17: { id: 17, name: 'Shanghai Port', shortName: 'SHA', logo: 'https://crests.football-data.org/1054.png', matchesPlayed: 30, goalsScored: 61, goalsConceded: 30, homeGoalsScored: 34, homeGoalsConceded: 14, homeMatches: 15, awayGoalsScored: 27, awayGoalsConceded: 16, awayMatches: 15, lastFive: ['W', 'D', 'L', 'W', 'W'] },
  18: { id: 18, name: 'Shandong Taishan', shortName: 'SHN', logo: 'https://crests.football-data.org/1056.png', matchesPlayed: 30, goalsScored: 59, goalsConceded: 25, homeGoalsScored: 33, homeGoalsConceded: 10, homeMatches: 15, awayGoalsScored: 26, awayGoalsConceded: 15, awayMatches: 15, lastFive: ['W', 'W', 'W', 'D', 'W'] },
};

export const MOCK_MATCHES: Match[] = [
  // PL
  { id: 101, utcDate: new Date(Date.now() + 86400000).toISOString(), status: 'SCHEDULED', homeTeam: { id: 1, name: 'Arsenal', logo: MOCK_TEAMS[1].logo }, awayTeam: { id: 2, name: 'Man City', logo: MOCK_TEAMS[2].logo }, leagueId: 'PL' },
  { id: 102, utcDate: new Date(Date.now() + 172800000).toISOString(), status: 'SCHEDULED', homeTeam: { id: 3, name: 'Liverpool', logo: MOCK_TEAMS[3].logo }, awayTeam: { id: 4, name: 'Chelsea', logo: MOCK_TEAMS[4].logo }, leagueId: 'PL' },
  // La Liga
  { id: 201, utcDate: new Date(Date.now() + 90000000).toISOString(), status: 'SCHEDULED', homeTeam: { id: 5, name: 'Real Madrid', logo: MOCK_TEAMS[5].logo }, awayTeam: { id: 6, name: 'Barcelona', logo: MOCK_TEAMS[6].logo }, leagueId: 'PD' },
  // Bundesliga
  { id: 301, utcDate: new Date(Date.now() + 95000000).toISOString(), status: 'SCHEDULED', homeTeam: { id: 7, name: 'Leverkusen', logo: MOCK_TEAMS[7].logo }, awayTeam: { id: 8, name: 'Bayern', logo: MOCK_TEAMS[8].logo }, leagueId: 'BL1' },
  // Eredivisie
  { id: 401, utcDate: new Date(Date.now() + 100000000).toISOString(), status: 'SCHEDULED', homeTeam: { id: 9, name: 'PSV', logo: MOCK_TEAMS[9].logo }, awayTeam: { id: 10, name: 'Ajax', logo: MOCK_TEAMS[10].logo }, leagueId: 'DED' },
  // Primeira Liga
  { id: 501, utcDate: new Date(Date.now() + 105000000).toISOString(), status: 'SCHEDULED', homeTeam: { id: 11, name: 'Benfica', logo: MOCK_TEAMS[11].logo }, awayTeam: { id: 12, name: 'Porto', logo: MOCK_TEAMS[12].logo }, leagueId: 'PPL' },
  // J1
  { id: 601, utcDate: new Date(Date.now() + 110000000).toISOString(), status: 'SCHEDULED', homeTeam: { id: 13, name: 'Vissel Kobe', logo: MOCK_TEAMS[13].logo }, awayTeam: { id: 14, name: 'Y. Marinos', logo: MOCK_TEAMS[14].logo }, leagueId: 'J1' },
  // Allsvenskan
  { id: 701, utcDate: new Date(Date.now() + 115000000).toISOString(), status: 'SCHEDULED', homeTeam: { id: 15, name: 'Malmo FF', logo: MOCK_TEAMS[15].logo }, awayTeam: { id: 16, name: 'Djurgardens', logo: MOCK_TEAMS[16].logo }, leagueId: 'ASV' },
  // Chinese Super League
  { id: 801, utcDate: new Date(Date.now() + 120000000).toISOString(), status: 'SCHEDULED', homeTeam: { id: 17, name: 'Shanghai Port', logo: MOCK_TEAMS[17].logo }, awayTeam: { id: 18, name: 'Shandong', logo: MOCK_TEAMS[18].logo }, leagueId: 'CSL' },
];
