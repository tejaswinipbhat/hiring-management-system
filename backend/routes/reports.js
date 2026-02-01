const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get dashboard metrics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const metrics = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM jobs WHERE status = $1', ['Open']),
      pool.query('SELECT COUNT(*) as count FROM applications'),
      pool.query('SELECT COUNT(*) as count FROM applications WHERE stage = $1', ['Interview Scheduled']),
      pool.query('SELECT COUNT(*) as count FROM applications WHERE stage = $1', ['Offer Extended']),
    ]);

    const candidatesByStage = await pool.query(`
      SELECT stage, COUNT(*) as count
      FROM applications
      GROUP BY stage
    `);

    const jobsByDepartment = await pool.query(`
      SELECT department, COUNT(*) as count
      FROM jobs
      WHERE status = 'Open'
      GROUP BY department
    `);

    res.json({
      openPositions: parseInt(metrics[0].rows[0].count),
      totalCandidates: parseInt(metrics[1].rows[0].count),
      interviewsScheduled: parseInt(metrics[2].rows[0].count),
      offersExtended: parseInt(metrics[3].rows[0].count),
      candidatesByStage: candidatesByStage.rows,
      jobsByDepartment: jobsByDepartment.rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Time-to-hire metrics
router.get('/time-to-hire', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        AVG(EXTRACT(DAY FROM (oa.hiring_manager_approved_at - a.applied_date))) as avg_days
      FROM applications a
      JOIN offer_approvals oa ON oa.application_id = a.id
      WHERE oa.status = 'Approved' OR oa.status = 'Accepted'
    `);
    res.json({ averageDays: parseFloat(result.rows[0].avg_days) || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Candidate conversion rates
router.get('/conversion-rates', authenticateToken, async (req, res) => {
  try {
    const stages = ['Applied', 'Shortlisted', 'Interview Scheduled', 'Offer Extended', 'Hired'];
    const result = await pool.query(`
      SELECT stage, COUNT(*) as count
      FROM applications
      WHERE stage = ANY($1)
      GROUP BY stage
    `, [stages]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
