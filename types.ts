
export interface TeamStats {
  id: number;
  name: string;
  shortName: string;
  logo: string;
  matchesPlayed: number;
  goalsScored: number;
  goalsConceded: number;
  homeGoalsScored: number;
  homeGoalsConceded: number;
  awayGoalsScored: number;
  awayGoalsConceded: number;
  homeMatches: number;
  awayMatches: number;
  lastFive: string[];
}

export interface LeagueStats {
  id: string;
  name: string;
  avgHomeGoals: number;
  avgAwayGoals: number;
  description: string;
  bestMarkets: string[];
}

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: { id: number; name: string; logo: string };
  awayTeam: { id: number; name: string; logo: string };
  leagueId: string;
}

export interface HistoricalMatch extends Match {
  homeGoals: number;
  awayGoals: number;
}

export interface BacktestResult {
  match: HistoricalMatch;
  prediction: PredictionResult;
  isOutcomeCorrect: boolean;
  isBTTSCorrect: boolean;
  isOver25Correct: boolean;
}

export interface PredictionResult {
  homeXG: number;
  awayXG: number;
  probabilities: {
    homeWin: number;
    draw: number;
    awayWin: number;
    btts: number;
    over25: number;
    under25: number;
  };
  scoreMatrix: number[][];
  mostLikelyScores: Array<{ score: string; prob: number }>;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AIAnalysis {
  insight: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  keyFactors: string[];
  sources?: GroundingSource[];
}

export type AppView = 'PREDICT' | 'BACKTEST' | 'LEAGUE_ANALYTICS' | 'SETTINGS' | 'MY_PREDICTIONS' | 'FEED';
