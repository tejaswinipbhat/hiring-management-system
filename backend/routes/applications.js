const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const multer = require('multer');
const path = require('path');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF and DOC files are allowed'));
  }
});

// Get all applications with filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { job_id, stage } = req.query;
    let query = `
      SELECT a.*, c.name, c.email, c.phone, j.title as job_title, j.department
      FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    const params = [];

    if (job_id) {
      params.push(job_id);
      query += ` AND a.job_id = $${params.length}`;
    }
    if (stage) {
      params.push(stage);
      query += ` AND a.stage = $${params.length}`;
    }

    query += ' ORDER BY a.applied_date DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Public application submission
router.post('/submit', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 }
]), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { name, email, phone, job_id } = req.body;
    const resumePath = req.files['resume'] ? req.files['resume'][0].path : null;
    const coverLetterPath = req.files['coverLetter'] ? req.files['coverLetter'][0].path : null;

    // Create candidate
    const candidateResult = await client.query(
      'INSERT INTO candidates (name, email, phone, resume_file_path, cover_letter_path) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, phone, resumePath, coverLetterPath]
    );
    const candidateId = candidateResult.rows[0].id;

    // Create application
    const applicationResult = await client.query(
      'INSERT INTO applications (candidate_id, job_id, stage) VALUES ($1, $2, $3) RETURNING *',
      [candidateId, job_id, 'Applied']
    );

    // TODO: Send confirmation email
    // TODO: Calculate match score

    await client.query('COMMIT');
    res.status(201).json({
      message: 'Application submitted successfully',
      application: applicationResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Server error', error: error.message });
  } finally {
    client.release();
  }
});

// Update application stage
router.put('/:id/stage', authenticateToken, authorizeRoles('Admin', 'Recruiter', 'Hiring Manager'), async (req, res) => {
  const { stage } = req.body;
  try {
    const result = await pool.query(
      'UPDATE applications SET stage = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [stage, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
