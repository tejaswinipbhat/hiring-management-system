-- TalentFlow Pro Database Schema

-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS interview_schedule CASCADE;
DROP TABLE IF EXISTS offer_approvals CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table with RBAC
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Recruiter', 'Hiring Manager', 'Business Head', 'HR Manager')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidates table
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    resume_link TEXT,
    resume_file_path TEXT,
    cover_letter_path TEXT,
    source VARCHAR(100) DEFAULT 'Direct Application',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table (linking candidates to jobs)
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER REFERENCES candidates(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    stage VARCHAR(100) NOT NULL DEFAULT 'Applied' CHECK (stage IN ('Applied', 'Shortlisted', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected')),
    match_score INTEGER DEFAULT 0,
    notes TEXT,
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(candidate_id, job_id)
);

-- Interview schedule table
CREATE TABLE interview_schedule (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    interview_type VARCHAR(100) NOT NULL CHECK (interview_type IN ('Tech Test', 'Tech Interview', 'HR Interview')),
    interviewer_id INTEGER REFERENCES users(id),
    scheduled_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')),
    bypass_logged BOOLEAN DEFAULT FALSE,
    bypass_by INTEGER REFERENCES users(id),
    bypass_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Offer approvals table (multi-level workflow)
CREATE TABLE offer_approvals (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    offer_details JSONB,
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending HM Approval', 'Pending BH Approval', 'Pending HR Approval', 'Approved', 'Rejected', 'Extended', 'Accepted', 'Declined')),

    -- Approver tracking
    recruiter_id INTEGER REFERENCES users(id),
    recruiter_submitted_at TIMESTAMP,

    hiring_manager_id INTEGER REFERENCES users(id),
    hiring_manager_status VARCHAR(50),
    hiring_manager_approved_at TIMESTAMP,
    hiring_manager_comments TEXT,

    business_head_id INTEGER REFERENCES users(id),
    business_head_status VARCHAR(50),
    business_head_approved_at TIMESTAMP,
    business_head_comments TEXT,

    hr_manager_id INTEGER REFERENCES users(id),
    hr_manager_status VARCHAR(50),
    hr_manager_approved_at TIMESTAMP,
    hr_manager_comments TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_stage ON applications(stage);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_interview_application ON interview_schedule(application_id);
CREATE INDEX idx_offer_application ON offer_approvals(application_id);

-- Insert default admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@talentflow.com', '$2a$10$rZ5VQJ1Y9bQrKxVKL.6U5uY9x.P0N8jVFz1x1yZGKdYm0fXqQG8Fe', 'Admin'),
('John Recruiter', 'recruiter@talentflow.com', '$2a$10$rZ5VQJ1Y9bQrKxVKL.6U5uY9x.P0N8jVFz1x1yZGKdYm0fXqQG8Fe', 'Recruiter'),
('Jane Manager', 'hm@talentflow.com', '$2a$10$rZ5VQJ1Y9bQrKxVKL.6U5uY9x.P0N8jVFz1x1yZGKdYm0fXqQG8Fe', 'Hiring Manager'),
('Bob Executive', 'bh@talentflow.com', '$2a$10$rZ5VQJ1Y9bQrKxVKL.6U5uY9x.P0N8jVFz1x1yZGKdYm0fXqQG8Fe', 'Business Head'),
('Sarah HR', 'hr@talentflow.com', '$2a$10$rZ5VQJ1Y9bQrKxVKL.6U5uY9x.P0N8jVFz1x1yZGKdYm0fXqQG8Fe', 'HR Manager');
