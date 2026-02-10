
import { TeamStats, LeagueStats, PredictionResult } from '../types';
import { getGoalProbabilities } from './poisson';

export const calculatePrediction = (
  homeTeam: TeamStats,
  awayTeam: TeamStats,
  league: LeagueStats
): PredictionResult => {
  // 1. Calculate relative strengths
  const homeAttack = (homeTeam.homeGoalsScored / homeTeam.homeMatches) / league.avgHomeGoals;
  const awayDefense = (awayTeam.awayGoalsConceded / awayTeam.awayMatches) / league.avgAwayGoals;
  
  const awayAttack = (awayTeam.awayGoalsScored / awayTeam.awayMatches) / league.avgAwayGoals;
  const homeDefense = (homeTeam.homeGoalsConceded / homeTeam.homeMatches) / league.avgHomeGoals;

  // 2. Calculate Expected Goals (xG)
  const homeXG = homeAttack * awayDefense * league.avgHomeGoals;
  const awayXG = awayAttack * homeDefense * league.avgAwayGoals;

  // 3. Generate Goal Probabilities (0 to 5+)
  const homeProbs = getGoalProbabilities(homeXG, 5);
  const awayProbs = getGoalProbabilities(awayXG, 5);

  // 4. Build Score Matrix (6x6)
  const matrix: number[][] = [];
  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;
  let btts = 0;
  let over25 = 0;
  const scores: Array<{ score: string; prob: number }> = [];

  for (let h = 0; h < 6; h++) {
    matrix[h] = [];
    for (let a = 0; a < 6; a++) {
      const prob = homeProbs[h] * awayProbs[a];
      matrix[h][a] = prob;

      if (h > a) homeWin += prob;
      else if (h === a) draw += prob;
      else awayWin += prob;

      if (h > 0 && a > 0) btts += prob;
      if (h + a > 2.5) over25 += prob;

      scores.push({ score: `${h}-${a}`, prob });
    }
  }

  return {
    homeXG,
    awayXG,
    probabilities: {
      homeWin,
      draw,
      awayWin,
      btts,
      over25,
      under25: 1 - over25
    },
    scoreMatrix: matrix,
    mostLikelyScores: scores.sort((a, b) => b.prob - a.prob).slice(0, 5)
  };
};
