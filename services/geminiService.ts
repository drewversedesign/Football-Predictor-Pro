import { Match, PredictionResult, AIAnalysis, TeamStats, HistoricalMatch } from "../types";
import { authClient } from './authService';

const API_URL = '/api';

export const getAIAnalysis = async (
  match: Match,
  homeTeam: TeamStats,
  awayTeam: TeamStats,
  prediction: PredictionResult
): Promise<AIAnalysis> => {
  const session = await authClient.getSession();

  const prompt = `
    Match: ${homeTeam.name} vs ${awayTeam.name}
    Model xG Prediction: ${prediction.homeXG.toFixed(2)} vs ${prediction.awayXG.toFixed(2)}
    Win Probabilities: H:${(prediction.probabilities.homeWin * 100).toFixed(0)}% D:${(prediction.probabilities.draw * 100).toFixed(0)}% A:${(prediction.probabilities.awayWin * 100).toFixed(0)}%
  `;

  try {
    const response = await fetch(`${API_URL}/gemini/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.data?.session?.token}`
      },
      body: JSON.stringify({ matchId: match.id, prompt })
    });
    
    const data = await response.json();
    return {
      insight: data.insight,
      riskLevel: data.risk_level,
      keyFactors: JSON.parse(data.key_factors),
      sources: JSON.parse(data.sources)
    };
  } catch (error) {
    console.error("AI Analysis failed", error);
    return {
      insight: "Automated analysis currently offline.",
      riskLevel: "Medium",
      keyFactors: ["Statistical xG baseline", "League historical averages", "Poisson distribution model"]
    };
  }
};

// Simplified fallbacks for now, in a real app these would also move to backend
export const fetchHistoricalResults = async (leagueName: string, leagueId: string): Promise<HistoricalMatch[]> => [];
export const fetchLiveFixtures = async (leagueName: string, leagueId: string): Promise<Match[]> => [];
export const fetchLiveTeamStats = async (teamName: string): Promise<Partial<TeamStats> | null> => null;
