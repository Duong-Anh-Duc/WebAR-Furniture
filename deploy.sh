#!/bin/bash

# WebAR Furniture Deployment Script
set -e

echo "🚀 Starting WebAR Furniture deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p backend/logs
mkdir -p backend/public/uploads
mkdir -p ssl
mkdir -p nginx/conf.d

# Copy environment file
if [ ! -f .env ]; then
    if [ -f .env.production ]; then
        cp .env.production .env
        print_status "Copied .env.production to .env"
    else
        print_warning "No .env file found. Please create one before deployment."
        exit 1
    fi
fi

# Build and start services
print_status "Building Docker images..."
docker-compose build --no-cache

print_status "Starting services..."
docker-compose up -d

# Wait for services to be healthy
print_status "Waiting for services to be ready..."
sleep 30

# Check service health
print_status "Checking service health..."
docker-compose ps

# Show logs
print_status "Showing recent logs..."
docker-compose logs --tail=50

print_status "✅ Deployment completed!"
print_status "Frontend: http://46.62.170.132"
print_status "Backend API: http://46.62.170.132:3000"
print_status ""
print_status "To monitor logs: docker-compose logs -f"
print_status "To stop services: docker-compose down"
print_status "To restart services: docker-compose restart"