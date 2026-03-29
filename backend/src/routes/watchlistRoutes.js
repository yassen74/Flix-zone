const express = require('express');
const {
  addMovieToWatchlist,
  getWatchlist,
  deleteWatchlistMovie
} = require('../controllers/watchlistController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);
router.post('/', addMovieToWatchlist);
router.get('/', getWatchlist);
router.delete('/:movieId', deleteWatchlistMovie);

module.exports = router;
