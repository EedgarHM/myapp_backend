const express = require('express')
const router  = express.Router()
const db      = require('../db')

// Crear tarea
router.post('/', async (req, res) => {
  const { title, description, user_id } = req.body
  if (!title || !user_id) {
    return res.status(400).json({ error: 'title y user_id son requeridos' })
  }
  try {
    const [result] = await db.query(
      'INSERT INTO tasks (title, description, user_id) VALUES (?, ?, ?)',
      [title, description, user_id]
    )
    res.status(201).json({ id: result.insertId, title, description, status: 'pending', user_id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Obtener tareas de un usuario
router.get('/:user_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [req.params.user_id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Actualizar status de una tarea
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body
  const validStatuses = ['pending', 'in_progress', 'completed']
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'status inválido' })
  }
  try {
    await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, req.params.id])
    res.json({ id: req.params.id, status })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id])
    res.json({ message: 'Tarea eliminada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router