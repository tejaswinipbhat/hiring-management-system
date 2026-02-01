const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Create offer (Recruiter)
router.post('/', authenticateToken, authorizeRoles('Recruiter'), async (req, res) => {
  const { application_id, offer_details } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO offer_approvals (application_id, offer_details, recruiter_id, recruiter_submitted_at, status)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 'Pending HM Approval') RETURNING *`,
      [application_id, JSON.stringify(offer_details), req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Approve/Reject offer (HM, BH, HR based on role)
router.put('/:id/approve', authenticateToken, async (req, res) => {
  const { status, comments } = req.body;
  const role = req.user.role;

  try {
    let updateQuery;
    let newStatus;

    if (role === 'Hiring Manager') {
      updateQuery = `UPDATE offer_approvals SET
        hiring_manager_id = $1, hiring_manager_status = $2, hiring_manager_comments = $3,
        hiring_manager_approved_at = CURRENT_TIMESTAMP, status = $4
        WHERE id = $5 RETURNING *`;
      newStatus = status === 'Approved' ? 'Pending BH Approval' : 'Rejected';
    } else if (role === 'Business Head') {
      updateQuery = `UPDATE offer_approvals SET
        business_head_id = $1, business_head_status = $2, business_head_comments = $3,
        business_head_approved_at = CURRENT_TIMESTAMP, status = $4
        WHERE id = $5 RETURNING *`;
      newStatus = status === 'Approved' ? 'Pending HR Approval' : 'Rejected';
    } else if (role === 'HR Manager') {
      updateQuery = `UPDATE offer_approvals SET
        hr_manager_id = $1, hr_manager_status = $2, hr_manager_comments = $3,
        hr_manager_approved_at = CURRENT_TIMESTAMP, status = $4
        WHERE id = $5 RETURNING *`;
      newStatus = status === 'Approved' ? 'Approved' : 'Rejected';
    } else {
      return res.status(403).json({ message: 'Unauthorized role for this action' });
    }

    const result = await pool.query(updateQuery, [req.user.id, status, comments, newStatus, req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get offers for application
router.get('/application/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM offer_approvals WHERE application_id = $1', [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
