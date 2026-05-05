require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const db      = require('./db')

const app  = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}))
app.use(express.json())

app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1')
    res.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    res.status(503).json({ status: 'error', db: err.message })
  }
})
app.use('/api/users', require('./routes/users'))
app.use('/api/tasks', require('./routes/tasks'))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`)
})