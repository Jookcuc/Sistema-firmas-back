import { pool } from '../../config/db.js'

export const createUser = async (first_name, last_name, email, password_hash, signature) => {
  const query = `
    INSERT INTO users (first_name, last_name, email, password_hash, signature)
    VALUES ($1, $2, $3, $4, $5) RETURNING *
  `
  const values = [first_name, last_name, email, password_hash, signature]
  const { rows } = await pool.query(query, values)
  return rows[0]
}

export const getUsers = async () => {
  const { rows } = await pool.query('SELECT * FROM users')
  return rows
}
