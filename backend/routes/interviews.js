const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Schedule interview
router.post('/', authenticateToken, authorizeRoles('Admin', 'Recruiter', 'Hiring Manager'), async (req, res) => {
  const { application_id, interview_type, interviewer_id, scheduled_date, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO interview_schedule (application_id, interview_type, interviewer_id, scheduled_date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [application_id, interview_type, interviewer_id, scheduled_date, notes]
    );
    // TODO: Send email notifications
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get interviews for application
router.get('/application/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM interview_schedule WHERE application_id = $1 ORDER BY scheduled_date',
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Bypass interview step
router.post('/:id/bypass', authenticateToken, async (req, res) => {
  const { reason } = req.body;
  try {
    const result = await pool.query(
      'UPDATE interview_schedule SET bypass_logged = true, bypass_by = $1, bypass_reason = $2 WHERE id = $3 RETURNING *',
      [req.user.id, reason, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
