#!/bin/bash

# * Docker Build Script for HealthLease Hub Backend
# * Builds and tests the Docker image with proper error handling
# * Docker-only setup (no Docker Compose)

set -e

# * Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# * Configuration
IMAGE_NAME="healthlease-hub-backend"
IMAGE_TAG="latest"
CONTAINER_NAME="healthlease-test"

# * Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# * Cleanup function
cleanup() {
    log_info "Cleaning up..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
}

# * Set trap for cleanup on exit
trap cleanup EXIT

# * Main build process
main() {
    log_info "Starting Docker build process for HealthLease Hub Backend"
    
    # * Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # * Build the Docker image
    log_info "Building Docker image: $IMAGE_NAME:$IMAGE_TAG"
    docker build -t $IMAGE_NAME:$IMAGE_TAG .
    
    if [ $? -eq 0 ]; then
        log_success "Docker image built successfully"
    else
        log_error "Docker build failed"
        exit 1
    fi
    
    # * Test the image
    log_info "Testing Docker image..."
    
    # * Start container
    log_info "Starting test container..."
    docker run -d \
        --name $CONTAINER_NAME \
        -p 3000:3000 \
        -e NODE_ENV=production \
        -e PORT=3000 \
        $IMAGE_NAME:$IMAGE_TAG
    
    if [ $? -eq 0 ]; then
        log_success "Container started successfully"
    else
        log_error "Failed to start container"
        exit 1
    fi
    
    # * Wait for container to be ready
    log_info "Waiting for container to be ready..."
    sleep 10
    
    # * Test health endpoint
    log_info "Testing health endpoint..."
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        log_success "Health endpoint is responding"
    else
        log_warning "Health endpoint test failed"
    fi
    
    # * Test root endpoint
    log_info "Testing root endpoint..."
    if curl -f http://localhost:3000/ >/dev/null 2>&1; then
        log_success "Root endpoint is responding"
    else
        log_warning "Root endpoint test failed"
    fi
    
    # * Test API documentation
    log_info "Testing API documentation..."
    if curl -f http://localhost:3000/doc >/dev/null 2>&1; then
        log_success "API documentation is accessible"
    else
        log_warning "API documentation test failed"
    fi
    
    # * Show container logs
    log_info "Container logs:"
    docker logs $CONTAINER_NAME --tail 20
    
    # * Show container status
    log_info "Container status:"
    docker ps --filter "name=$CONTAINER_NAME"
    
    log_success "Docker build and test completed successfully!"
    log_info "Image: $IMAGE_NAME:$IMAGE_TAG"
    log_info "Container: $CONTAINER_NAME"
    log_info "Access the application at: http://localhost:3000"
    log_info "API documentation at: http://localhost:3000/ui"
}

# * Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -t, --tag      Set image tag (default: latest)"
    echo "  -n, --name     Set image name (default: healthlease-hub-backend)"
    echo "  --no-test      Skip container testing"
    echo ""
    echo "Examples:"
    echo "  $0                    # Build with default settings"
    echo "  $0 -t v1.0.0          # Build with specific tag"
    echo "  $0 --no-test           # Build without testing"
}

# * Parse command line arguments
NO_TEST=false
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -t|--tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        -n|--name)
            IMAGE_NAME="$2"
            shift 2
            ;;
        --no-test)
            NO_TEST=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# * Run main function
main
