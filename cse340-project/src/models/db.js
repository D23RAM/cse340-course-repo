import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

pool.on('connect', () => {
  console.log('Database connected')
})

pool.on('error', (err) => {
  console.error('Unexpected database error:', err)
})

const query = async (text, params) => {
  const start = Date.now()
  const result = await pool.query(text, params)

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log('Executed query', {
      text,
      duration: Date.now() - start,
      rows: result.rowCount,
    })
  }

  return result
}

const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()')
    console.log('Database connection successful:', result.rows[0])
  } catch (error) {
    console.error('Database connection failed:', error)
  }
}

export { query, testConnection }
export default { query, testConnection }