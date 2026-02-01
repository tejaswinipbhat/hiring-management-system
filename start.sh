#!/bin/bash

echo "========================================"
echo "TalentFlow Pro - Hiring Management System"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if this is first run
if [ ! -f "backend/.env" ]; then
    echo "📝 First time setup detected..."
    echo "Creating backend/.env file..."
    cp backend/.env.example backend/.env
    echo "✅ Environment file created"
    echo ""
fi

# Build services
echo "🔨 Building Docker containers..."
bash ./docker-compose.sh build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Build completed successfully"
echo ""

# Start services
echo "🚀 Starting services..."
bash ./docker-compose.sh up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start services. Please check the errors above."
    exit 1
fi

echo "✅ Services started successfully"
echo ""

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Initialize database
echo "🗄️  Initializing database..."
docker-compose exec -T backend npm run init-db

if [ $? -ne 0 ]; then
    echo "⚠️  Database initialization failed. You may need to run it manually:"
    echo "   docker-compose exec backend npm run init-db"
else
    echo "✅ Database initialized successfully"
fi

echo ""
echo "========================================"
echo "🎉 TalentFlow Pro is ready!"
echo "========================================"
echo ""
echo "Access the application:"
echo "  Frontend:    http://localhost:8000"
echo "  Backend API: http://localhost:5000"
echo "  Health Check: http://localhost:5000/api/health"
echo ""
echo "Default login credentials:"
echo "  Email:    admin@talentflow.com"
echo "  Password: admin123"
echo ""
echo "Other users:"
echo "  - recruiter@talentflow.com (Recruiter)"
echo "  - hm@talentflow.com (Hiring Manager)"
echo "  - bh@talentflow.com (Business Head)"
echo "  - hr@talentflow.com (HR Manager)"
echo "  All passwords: admin123"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop services: bash ./docker-compose.sh down"
echo ""
echo "For detailed documentation, see:"
echo "  - README.md"
echo "  - DEPLOYMENT.md"
echo "========================================"
