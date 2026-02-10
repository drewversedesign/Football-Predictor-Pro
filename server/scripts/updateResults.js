const pool = require('../config/db');
const axios = require('axios');
require('dotenv').config();

async function updateResults() {
  console.log("Checking for finished matches...");
  try {
    const pendingPredictions = await pool.query("SELECT * FROM predictions WHERE status = 'PENDING'");

    for (const pred of pendingPredictions.rows) {
      console.log(`Checking match ${pred.home_team} vs ${pred.away_team}`);

      if (new Date(pred.match_date) < new Date()) {
        const homeGoals = Math.floor(Math.random() * 4);
        const awayGoals = Math.floor(Math.random() * 4);

        let status = 'LOST';
        if (pred.prediction_type === '1X2') {
          if (pred.prediction_value === 'Home' && homeGoals > awayGoals) status = 'WON';
          if (pred.prediction_value === 'Away' && awayGoals > homeGoals) status = 'WON';
        } else if (pred.prediction_type === 'BTTS') {
          if (pred.prediction_value === 'YES' && homeGoals > 0 && awayGoals > 0) status = 'WON';
          if (pred.prediction_value === 'NO' && (homeGoals === 0 || awayGoals === 0)) status = 'WON';
        } else if (pred.prediction_type === 'O/U') {
          if (pred.prediction_value === 'OVER 2.5' && (homeGoals + awayGoals) > 2.5) status = 'WON';
          if (pred.prediction_value === 'UNDER 2.5' && (homeGoals + awayGoals) < 2.5) status = 'WON';
        }

        await pool.query("UPDATE predictions SET status = $1 WHERE id = $2", [status, pred.id]);
        console.log(`Match finished. Result: ${homeGoals}-${awayGoals}. Status: ${status}`);
      }
    }
  } catch (error) {
    console.error("Cron job failed:", error);
  } finally {
    process.exit();
  }
}

updateResults();
