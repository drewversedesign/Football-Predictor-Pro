const axios = require('axios');

const API_FOOTBALL_URL = 'https://v3.football.api-sports.io';
const FOOTBALL_DATA_URL = 'https://api.football-data.org/v4';

exports.getFixtures = async (req, res) => {
  const { leagueId, provider } = req.query;
  try {
    if (provider === 'api-football') {
      const response = await axios.get(`${API_FOOTBALL_URL}/fixtures?league=${leagueId}&season=2024&next=10`, {
        headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY }
      });
      res.json(response.data);
    } else {
      const response = await axios.get(`${FOOTBALL_DATA_URL}/competitions/${leagueId}/matches?status=SCHEDULED`, {
        headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY }
      });
      res.json(response.data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
