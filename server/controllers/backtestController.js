const pool = require('../config/db');

exports.saveBacktest = async (req, res) => {
  const { leagueId, season, accuracy1x2, accuracyBtts, accuracyOverUnder, totalMatches } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO backtest_results (league_id, season, accuracy_1x2, accuracy_btts, accuracy_over_under, total_matches) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (league_id, season) DO UPDATE SET accuracy_1x2 = EXCLUDED.accuracy_1x2, accuracy_btts = EXCLUDED.accuracy_btts, accuracy_over_under = EXCLUDED.accuracy_over_under, total_matches = EXCLUDED.total_matches, created_at = NOW() RETURNING *',
      [leagueId, season, accuracy1x2, accuracyBtts, accuracyOverUnder, totalMatches]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBacktestResults = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM backtest_results ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
