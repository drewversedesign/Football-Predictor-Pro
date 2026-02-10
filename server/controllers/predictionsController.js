const pool = require('../config/db');

exports.savePrediction = async (req, res) => {
  const { matchId, homeTeam, awayTeam, matchDate, predictedHomeXg, predictedAwayXg, predictionType, predictionValue } = req.body;
  const userId = req.user.sub; // From JWT

  try {
    const result = await pool.query(
      'INSERT INTO predictions (user_id, match_id, home_team, away_team, match_date, predicted_home_xg, predicted_away_xg, prediction_type, prediction_value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [userId, matchId, homeTeam, awayTeam, matchDate, predictedHomeXg, predictedAwayXg, predictionType, predictionValue]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPredictions = async (req, res) => {
  const userId = req.user.sub;
  try {
    const result = await pool.query('SELECT * FROM predictions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExpertFeed = async (req, res) => {
  try {
    // For the feed, we'll fetch predictions with high xG or high confidence probabilities
    // We'll also include cached analyses
    const result = await pool.query(`
      SELECT p.*, c.insight, c.risk_level
      FROM predictions p
      LEFT JOIN cached_analyses c ON p.match_id = c.match_id
      WHERE p.predicted_home_xg > 2.5 OR p.predicted_away_xg > 2.5
      ORDER BY p.created_at DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
