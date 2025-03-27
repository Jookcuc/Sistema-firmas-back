import { pool } from '../../config/db.js'

export const createUser = async (first_name, last_name, email, password_hash, signature) => {
  const query = `
    INSERT INTO users (first_name, last_name, email, password_hash, signature, verified)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, email, verified
  `
  const values = [first_name, last_name, email, password_hash, signature, false]
  const { rows } = await pool.query(query, values)
  return rows[0]
}

export const verifyUserInDatabase = async (email) => {
  const query = `
    UPDATE users SET verified = true WHERE email = $1
    RETURNING id, first_name, last_name, email, verified
  `
  const { rows } = await pool.query(query, [email])
  return rows[0]
}

export const getUsers = async () => {
  const { rows } = await pool.query('SELECT id, first_name, last_name, email, verified FROM users')
  return rows
}

export const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1'
  const { rows } = await pool.query(query, [email])
  return rows[0]
}

export const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1'
  const { rows } = await pool.query(query, [email])
  return rows.length > 0
}