const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get all jobs (public + authenticated)
router.get('/', async (req, res) => {
  try {
    const { status, department } = req.query;
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (department) {
      params.push(department);
      query += ` AND department = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create job (Recruiter, Admin)
router.post('/', authenticateToken, authorizeRoles('Admin', 'Recruiter'), async (req, res) => {
  const { title, department, description, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO jobs (title, department, description, status, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, department, description, status || 'Open', req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update job
router.put('/:id', authenticateToken, authorizeRoles('Admin', 'Recruiter'), async (req, res) => {
  const { title, department, description, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE jobs SET title = $1, department = $2, description = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [title, department, description, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
