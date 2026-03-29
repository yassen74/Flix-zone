const express = require('express');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie
} = require('../controllers/movieController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getMovies);
router.get('/:id', getMovie);
router.post('/', authenticateToken, authorizeAdmin, createMovie);
router.put('/:id', authenticateToken, authorizeAdmin, updateMovie);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteMovie);

module.exports = router;
