# TalentFlow Pro - Hiring Management System

A comprehensive full-stack hiring management system built with React, Node.js, Express, and PostgreSQL.

## Project Overview

This project is developed in 3 phases:

### Phase 1: Dashboard & Overview
- Basic React dashboard with hiring metrics
- Data visualization using Recharts
- Static data from JSON files
- Responsive UI with Tailwind CSS

### Phase 2: CRUD & Client-Side Pipeline 
- React Router integration
- Job and Candidate CRUD operations
- Local Storage data persistence
- Context API for state management
- Form validation with Yup
- Enhanced dashboard with live data

### Phase 3: Full-Stack & Advanced Features
- Node.js/Express REST API
- PostgreSQL database
- JWT authentication
- Role-Based Access Control (RBAC)
- File upload handling
- Multi-level offer approval workflow
- Interview scheduling system
- Advanced reporting and analytics
- Email notifications (configured)

## Technologies Used

### Frontend
- React 18
- React Router
- Tailwind CSS
- Recharts
- Yup (validation)
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (jsonwebtoken)
- Bcrypt
- Multer (file uploads)
- Nodemailer (email)

### DevOps
- Docker & Docker Compose
- Nginx

## Quick Start

### Using Docker (Recommended)

1. Build and start all services:
```bash
bash ./docker-compose.sh build
bash ./docker-compose.sh up
```

2. Initialize the database:
```bash
docker-compose exec backend npm run init-db
```

3. Access the application:
- **Frontend**: http://localhost:8000
- **Backend API**: http://localhost:5000

4. Stop services:
```bash
bash ./docker-compose.sh down
```

### Default Users

| Email | Password | Role |
|-------|----------|------|
| admin@talentflow.com | admin123 | Admin |
| recruiter@talentflow.com | admin123 | Recruiter |
| hm@talentflow.com | admin123 | Hiring Manager |
| bh@talentflow.com | admin123 | Business Head |
| hr@talentflow.com | admin123 | HR Manager |

## Features

### User Roles & Permissions

- **Admin**: Full system access
- **Recruiter**: Manage jobs, candidates, initiate offers
- **Hiring Manager**: Review candidates, approve offers
- **Business Head**: Final approval for senior roles
- **HR Manager**: Final offer approval, compliance oversight

### Key Features

1. **Job Management**: Create, edit, delete job postings
2. **Candidate Pipeline**: Track candidates through hiring stages
3. **Application Portal**: Public-facing job application submission
4. **Interview Scheduling**: Schedule and track interviews with bypass option
5. **Offer Workflow**: Multi-level approval process (Recruiter → HM → BH → HR)
6. **File Uploads**: Resume and cover letter handling
7. **Email Notifications**: Automated communication
8. **Analytics Dashboard**: Real-time hiring metrics
9. **Advanced Reports**: Time-to-hire, conversion rates, candidate sources

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all jobs (public)
- `POST /api/jobs` - Create job (Auth: Recruiter, Admin)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job (Admin only)

### Applications
- `POST /api/applications/submit` - Submit application (Public + file upload)
- `GET /api/applications` - Get all applications (Auth)
- `PUT /api/applications/:id/stage` - Update stage

### Interviews
- `POST /api/interviews` - Schedule interview
- `POST /api/interviews/:id/bypass` - Bypass step (logged)

### Offers
- `POST /api/offers` - Create offer (Recruiter)
- `PUT /api/offers/:id/approve` - Approve/reject (HM, BH, HR)

### Reports
- `GET /api/reports/dashboard` - Dashboard metrics
- `GET /api/reports/time-to-hire` - Analytics
- `GET /api/reports/conversion-rates` - Conversion data

## Project Structure

```
hiring-dashboard/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth & RBAC middleware
│   ├── routes/             # API routes
│   ├── scripts/            # Database scripts
│   └── server.js           # Main server file
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── context/            # Context API (Phase 2)
│   ├── pages/              # Page components
│   ├── utils/              # Utilities
│   ├── validation/         # Yup schemas
│   └── App.jsx             # Main app component
├── public/                 # Static files
├── docker-compose.yml      # Docker services
└── package.json            # Frontend dependencies
```

## Development

### Local Development (Without Docker)

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
npm install
npm run dev
```

### Database Management

Reset database:
```bash
docker-compose exec backend npm run init-db
```

Access PostgreSQL:
```bash
docker-compose exec postgres psql -U postgres -d talentflow_db
```

## URLs

- Frontend: http://localhost:8000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

## Notes

- Phase 2 can run standalone with Local Storage
- Phase 3 requires backend API and PostgreSQL
- Email functionality requires SMTP config in backend/.env
- File uploads stored in backend/uploads/
- All demo users have password: `admin123`

## License

Educational/Demonstration Project
