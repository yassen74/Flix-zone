const { getMovieById } = require('../models/movieModel');
const {
  findWatchlistItem,
  addToWatchlist,
  getWatchlistByUserId,
  removeFromWatchlist
} = require('../models/watchlistModel');

async function addMovieToWatchlist(req, res, next) {
  try {
    const movieId = Number(req.body.movie_id);
    const userId = req.user.id;

    if (!req.body.movie_id) {
      return res.status(400).json({
        success: false,
        message: 'movie_id is required'
      });
    }

    if (Number.isNaN(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'movie_id must be a valid number'
      });
    }

    const movie = await getMovieById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    const existingWatchlistItem = await findWatchlistItem(userId, movieId);
    if (existingWatchlistItem) {
      return res.status(409).json({
        success: false,
        message: 'Movie is already in the watchlist'
      });
    }

    const watchlistItem = await addToWatchlist(userId, movieId);

    return res.status(201).json({
      success: true,
      message: 'Movie added to watchlist',
      data: watchlistItem
    });
  } catch (error) {
    return next(error);
  }
}

async function getWatchlist(req, res, next) {
  try {
    const watchlist = await getWatchlistByUserId(req.user.id);

    return res.status(200).json({
      success: true,
      count: watchlist.length,
      data: watchlist
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteWatchlistMovie(req, res, next) {
  try {
    const movieId = Number(req.params.movieId);

    if (Number.isNaN(movieId)) {
      return res.status(400).json({
        success: false,
        message: 'movieId must be a valid number'
      });
    }

    const existingWatchlistItem = await findWatchlistItem(req.user.id, movieId);
    if (!existingWatchlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found in watchlist'
      });
    }

    await removeFromWatchlist(req.user.id, movieId);

    return res.status(200).json({
      success: true,
      message: 'Movie removed from watchlist'
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addMovieToWatchlist,
  getWatchlist,
  deleteWatchlistMovie
};
