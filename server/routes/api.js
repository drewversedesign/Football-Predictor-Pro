const express = require('express');
const router = express.Router();
const footballController = require('../controllers/footballController');
const geminiController = require('../controllers/geminiController');
const predictionsController = require('../controllers/predictionsController');
const backtestController = require('../controllers/backtestController');
const checkAuth = require('../middleware/auth');

router.get('/fixtures', footballController.getFixtures);
router.post('/gemini/analyze', geminiController.analyzeMatch);

// Protected routes
router.post('/predictions', checkAuth, predictionsController.savePrediction);
router.get('/predictions', checkAuth, predictionsController.getPredictions);
router.get('/feed', checkAuth, predictionsController.getExpertFeed);
router.post('/backtest', checkAuth, backtestController.saveBacktest);
router.get('/backtest', checkAuth, backtestController.getBacktestResults);

module.exports = router;
