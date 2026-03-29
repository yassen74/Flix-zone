const { pool } = require('../config/db');

async function findWatchlistItem(userId, movieId) {
  const [rows] = await pool.query(
    'SELECT id, user_id, movie_id, created_at FROM watchlist WHERE user_id = ? AND movie_id = ? LIMIT 1',
    [userId, movieId]
  );

  return rows[0] || null;
}

async function addToWatchlist(userId, movieId) {
  const [result] = await pool.query(
    'INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)',
    [userId, movieId]
  );

  const [rows] = await pool.query(
    'SELECT id, user_id, movie_id, created_at FROM watchlist WHERE id = ? LIMIT 1',
    [result.insertId]
  );

  return rows[0] || null;
}

async function getWatchlistByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT
        w.id AS watchlist_id,
        w.created_at AS watchlist_created_at,
        m.id,
        m.title,
        m.description,
        m.genre,
        m.release_year,
        m.rating,
        m.poster_url,
        m.trailer_url,
        m.created_at
     FROM watchlist w
     INNER JOIN movies m ON m.id = w.movie_id
     WHERE w.user_id = ?
     ORDER BY w.created_at DESC`,
    [userId]
  );

  return rows;
}

async function removeFromWatchlist(userId, movieId) {
  const [result] = await pool.query(
    'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
    [userId, movieId]
  );

  return result.affectedRows > 0;
}

module.exports = {
  findWatchlistItem,
  addToWatchlist,
  getWatchlistByUserId,
  removeFromWatchlist
};
