const { pool } = require('../config/db');

async function getAllMovies() {
  const [rows] = await pool.query(
    `SELECT id, title, description, genre, release_year, rating, poster_url, trailer_url, created_at
     FROM movies
     ORDER BY created_at DESC`
  );

  return rows;
}

async function getMovieById(id) {
  const [rows] = await pool.query(
    `SELECT id, title, description, genre, release_year, rating, poster_url, trailer_url, created_at
     FROM movies
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function createMovie(movieData) {
  const { title, description, genre, release_year, rating, poster_url, trailer_url } = movieData;

  const [result] = await pool.query(
    `INSERT INTO movies (title, description, genre, release_year, rating, poster_url, trailer_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, description, genre, release_year, rating, poster_url, trailer_url]
  );

  return getMovieById(result.insertId);
}

async function updateMovie(id, movieData) {
  const { title, description, genre, release_year, rating, poster_url, trailer_url } = movieData;

  await pool.query(
    `UPDATE movies
     SET title = ?, description = ?, genre = ?, release_year = ?, rating = ?, poster_url = ?, trailer_url = ?
     WHERE id = ?`,
    [title, description, genre, release_year, rating, poster_url, trailer_url, id]
  );

  return getMovieById(id);
}

async function deleteMovie(id) {
  const [result] = await pool.query('DELETE FROM movies WHERE id = ?', [id]);

  return result.affectedRows > 0;
}

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};
