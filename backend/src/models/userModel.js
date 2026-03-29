const { pool } = require('../config/db');

async function findUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT id, username, email, password, role, created_at FROM users WHERE email = ? LIMIT 1',
    [email]
  );

  return rows[0] || null;
}

async function findUserByUsername(username) {
  const [rows] = await pool.query(
    'SELECT id, username, email, password, role, created_at FROM users WHERE username = ? LIMIT 1',
    [username]
  );

  return rows[0] || null;
}

async function findUserById(id) {
  const [rows] = await pool.query(
    'SELECT id, username, email, role, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );

  return rows[0] || null;
}

async function createUser(userData) {
  const { username, email, password, role = 'user' } = userData;

  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, password, role]
  );

  return findUserById(result.insertId);
}

module.exports = {
  findUserByEmail,
  findUserByUsername,
  findUserById,
  createUser
};
