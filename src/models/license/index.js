import { pool } from '../../config/db.js'
import crypto from 'crypto'

export const generateLicense = async (userId) => {
  const licenseKey = crypto.randomBytes(16).toString('hex')

  const query = `
    INSERT INTO licenses (user_id, license_key)
    VALUES ($1, $2) RETURNING *
  `
  const values = [userId, licenseKey]
  const { rows } = await pool.query(query, values)
  return rows[0]
}
