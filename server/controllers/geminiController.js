const { GoogleGenAI } = require("@google/genai");
const pool = require('../config/db');

const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

exports.analyzeMatch = async (req, res) => {
  const { matchId, prompt, matchData } = req.body;

  try {
    // Check cache
    const cached = await pool.query('SELECT * FROM cached_analyses WHERE match_id = $1', [matchId]);
    if (cached.rows.length > 0) {
      return res.json(cached.rows[0]);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse result and store in cache
    // (Simplified for now, in reality you'd parse the structured text)
    const analysis = {
      match_id: matchId,
      insight: text.split('\n')[0],
      risk_level: text.toLowerCase().includes('high risk') ? 'High' : 'Medium',
      key_factors: JSON.stringify(text.split('\n').slice(1, 4)),
      sources: JSON.stringify([]),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h cache
    };

    await pool.query(
      'INSERT INTO cached_analyses (match_id, insight, risk_level, key_factors, sources, expires_at) VALUES ($1, $2, $3, $4, $5, $6)',
      [analysis.match_id, analysis.insight, analysis.risk_level, analysis.key_factors, analysis.sources, analysis.expires_at]
    );

    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
