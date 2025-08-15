#!/bin/bash

# Swipevest Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting Swipevest deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    required_vars=(
        "NEXT_PUBLIC_FIREBASE_API_KEY"
        "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
        "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID"
        "NEXT_PUBLIC_CUSD_TOKEN_ADDRESS"
        "PRIVATE_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_error "Required environment variable $var is not set"
            exit 1
        fi
    done
    
    print_success "All required environment variables are set"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Compile smart contracts
compile_contracts() {
    print_status "Compiling smart contracts..."
    npm run compile
    print_success "Smart contracts compiled"
}

# Deploy smart contracts (if not already deployed)
deploy_contracts() {
    print_status "Checking contract deployment..."
    
    if [ -z "$NEXT_PUBLIC_DIRECT_INVESTMENT_ADDRESS" ]; then
        print_status "Deploying smart contracts to Celo Alfajores..."
        npm run deploy
        print_success "Smart contracts deployed"
    else
        print_success "Smart contracts already deployed at $NEXT_PUBLIC_DIRECT_INVESTMENT_ADDRESS"
    fi
}

# Build the application
build_app() {
    print_status "Building Next.js application..."
    npm run build
    print_success "Application built successfully"
}

# Run tests (if they exist)
run_tests() {
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        print_status "Running tests..."
        npm test
        print_success "All tests passed"
    else
        print_warning "No tests found, skipping test phase"
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    if command -v vercel &> /dev/null; then
        vercel --prod --yes
        print_success "Deployed to Vercel successfully"
    else
        print_warning "Vercel CLI not found. Please install it with: npm i -g vercel"
        print_status "You can manually deploy by pushing to your connected GitHub repository"
    fi
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    # Check prerequisites
    check_env_vars
    
    # Install and build
    install_dependencies
    compile_contracts
    deploy_contracts
    
    # Test and build
    run_tests
    build_app
    
    # Deploy
    deploy_to_vercel
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Your Swipevest app should now be live!"
    
    # Print useful information
    echo ""
    echo "📋 Deployment Summary:"
    echo "- Smart contracts: Deployed to Celo Alfajores"
    echo "- Frontend: Deployed to Vercel"
    echo "- Database: Firebase Firestore"
    echo "- Storage: Firebase Storage"
    echo ""
    echo "🔗 Useful Links:"
    echo "- Celo Explorer: https://alfajores.celoscan.io/"
    echo "- Firebase Console: https://console.firebase.google.com/"
    echo "- Vercel Dashboard: https://vercel.com/dashboard"
}

# Run the main function
main "$@"