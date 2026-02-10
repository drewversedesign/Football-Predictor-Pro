
import { GoogleGenAI, Type } from "@google/genai";
import { Match, PredictionResult, AIAnalysis, TeamStats, GroundingSource, HistoricalMatch } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Google Search Grounding to find actual recent historical results for a league.
 * Used for leagues NOT supported by the free tier of the football-data API.
 */
export const fetchHistoricalResults = async (leagueName: string, leagueId: string): Promise<HistoricalMatch[]> => {
  const prompt = `
    Find the 5 most recent finished football matches for the ${leagueName} (2024/2025 season).
    Include the home team name, away team name, final score (home goals and away goals), and match date.
    Ensure team names are full official names.
    Return the data as a clean JSON array of historical match objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              homeTeamName: { type: Type.STRING },
              awayTeamName: { type: Type.STRING },
              homeGoals: { type: Type.NUMBER },
              awayGoals: { type: Type.NUMBER },
              utcDate: { type: Type.STRING }
            },
            required: ["homeTeamName", "awayTeamName", "homeGoals", "awayGoals", "utcDate"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '[]');
    
    return rawData.map((m: any) => ({
      id: Math.floor(Math.random() * 999999),
      utcDate: m.utcDate,
      status: 'FINISHED',
      homeGoals: m.homeGoals,
      awayGoals: m.awayGoals,
      homeTeam: { 
        id: Math.floor(Math.random() * 500), 
        name: m.homeTeamName, 
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.homeTeamName)}&background=0f172a&color=10b981&bold=true` 
      },
      awayTeam: { 
        id: Math.floor(Math.random() * 500) + 500, 
        name: m.awayTeamName, 
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.awayTeamName)}&background=0f172a&color=ef4444&bold=true` 
      },
      leagueId: leagueId
    }));
  } catch (error) {
    console.error("Failed to fetch historical results via Gemini", error);
    return [];
  }
};

/**
 * Uses Google Search Grounding to find the actual upcoming fixtures for a given league.
 * Used as a robust fallback for specialty leagues.
 */
export const fetchLiveFixtures = async (leagueName: string, leagueId: string): Promise<Match[]> => {
  const prompt = `
    Find the next 5 upcoming football matches for the ${leagueName} (2024/2025 season).
    Include the home team name, away team name, and the scheduled UTC date/time.
    Return the data as a clean JSON array of match objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              homeTeamName: { type: Type.STRING },
              awayTeamName: { type: Type.STRING },
              utcDate: { type: Type.STRING, description: "ISO 8601 format" }
            },
            required: ["homeTeamName", "awayTeamName", "utcDate"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || '[]');
    
    return rawData.map((m: any) => ({
      id: Math.floor(Math.random() * 1000000),
      utcDate: m.utcDate,
      status: 'SCHEDULED',
      homeTeam: { 
        id: Math.floor(Math.random() * 1000), 
        name: m.homeTeamName, 
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.homeTeamName)}&background=0f172a&color=10b981&bold=true` 
      },
      awayTeam: { 
        id: Math.floor(Math.random() * 1000) + 1000, 
        name: m.awayTeamName, 
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.awayTeamName)}&background=0f172a&color=ef4444&bold=true` 
      },
      leagueId: leagueId
    }));
  } catch (error) {
    console.error("Failed to fetch live fixtures via Gemini", error);
    return [];
  }
};

export const getAIAnalysis = async (
  match: Match,
  homeTeam: TeamStats,
  awayTeam: TeamStats,
  prediction: PredictionResult
): Promise<AIAnalysis> => {
  const systemInstruction = `
    You are a world-class football tactical analyst and betting expert. 
    Analyze the match between ${homeTeam.name} and ${awayTeam.name}.
    You have access to current news and injuries via Google Search.
    Your goal is to identify tactical mismatches and high-value prediction adjustments.
    Be concise, data-driven, and highlight risk levels accurately.
  `;

  const prompt = `
    Match: ${homeTeam.name} vs ${awayTeam.name}
    Model xG Prediction: ${prediction.homeXG.toFixed(2)} vs ${prediction.awayXG.toFixed(2)}
    Win Probabilities: H:${(prediction.probabilities.homeWin * 100).toFixed(0)}% D:${(prediction.probabilities.draw * 100).toFixed(0)}% A:${(prediction.probabilities.awayWin * 100).toFixed(0)}%
    
    RESEARCH TASKS:
    1. Check for key injuries/suspensions reported in the last 48 hours.
    2. Assess team motivation (European commitments, relegation pressure).
    3. Review the last 2 head-to-head results.
    
    OUTPUT FORMAT:
    One sharp tactical sentence.
    Risk Level: Low/Medium/High.
    3 Bullet points of key factors.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      }
    });

    const sources: GroundingSource[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Source",
        uri: chunk.web.uri || "#"
      })) || [];

    const text = response.text || "";
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    
    return {
      insight: lines[0] || "Statistical variance is the primary factor in this matchup.",
      riskLevel: text.toLowerCase().includes("high risk") ? "High" : text.toLowerCase().includes("low risk") ? "Low" : "Medium",
      keyFactors: lines.slice(1, 4).map(l => l.replace(/^[*-]\s+/, '').trim()).slice(0, 3),
      sources
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

export const fetchLiveTeamStats = async (teamName: string): Promise<Partial<TeamStats> | null> => {
  const prompt = `
    Search for the current 2024/25 season statistics for ${teamName} football club.
    Include matches played, goals scored/conceded total, and specifically the home/away split.
    Include last 5 match results (e.g. W, L, D, W, W).
    Return a precise JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchesPlayed: { type: Type.NUMBER },
            goalsScored: { type: Type.NUMBER },
            goalsConceded: { type: Type.NUMBER },
            homeGoalsScored: { type: Type.NUMBER },
            homeGoalsConceded: { type: Type.NUMBER },
            awayGoalsScored: { type: Type.NUMBER },
            awayGoalsConceded: { type: Type.NUMBER },
            homeMatches: { type: Type.NUMBER },
            awayMatches: { type: Type.NUMBER },
            lastFive: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["matchesPlayed", "goalsScored", "goalsConceded"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Failed to fetch live stats via Gemini Search", error);
    return null;
  }
};
