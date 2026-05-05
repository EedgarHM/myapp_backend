const express = require('express')
const router  = express.Router()
const db      = require('../db')

// Crear usuario
router.post('/', async (req, res) => {
  const { username } = req.body
  if (!username) {
    return res.status(400).json({ error: 'username es requerido' })
  }
  try {
    const [result] = await db.query(
      'INSERT INTO users (username) VALUES (?)',
      [username]
    )
    res.status(201).json({ id: result.insertId, username })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router