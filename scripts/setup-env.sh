#!/bin/bash

# Swipevest Environment Setup Script
# This script helps set up the development environment

set -e

echo "🔧 Setting up Swipevest development environment..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

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

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
        
        # Check if version is 18 or higher
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            print_warning "Node.js version 18 or higher is recommended. Current: $NODE_VERSION"
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Install dependencies
install_deps() {
    print_status "Installing project dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Create .env file if it doesn't exist
setup_env_file() {
    if [ ! -f ".env" ]; then
        print_status "Creating .env file from template..."
        cat > .env << EOL
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Wallet Connect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Celo Network Configuration
NEXT_PUBLIC_CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
NEXT_PUBLIC_CUSD_TOKEN_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1

# Contract Addresses (will be populated after deployment)
NEXT_PUBLIC_BUSINESS_REGISTRY_ADDRESS=
NEXT_PUBLIC_DIRECT_INVESTMENT_ADDRESS=
NEXT_PUBLIC_ESCROW_MANAGER_ADDRESS=

# Development
PRIVATE_KEY=your_private_key_for_contract_deployment
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
EOL
        print_success ".env file created"
        print_warning "Please update the .env file with your actual configuration values"
    else
        print_success ".env file already exists"
    fi
}

# Setup Git hooks (optional)
setup_git_hooks() {
    if [ -d ".git" ]; then
        print_status "Setting up Git hooks..."
        
        # Pre-commit hook
        cat > .git/hooks/pre-commit << 'EOL'
#!/bin/bash
echo "Running pre-commit checks..."

# Run linting
npm run lint
if [ $? -ne 0 ]; then
    echo "Linting failed. Please fix the issues before committing."
    exit 1
fi

# Run type checking
npm run type-check 2>/dev/null || echo "Type checking skipped (script not found)"

echo "Pre-commit checks passed!"
EOL
        
        chmod +x .git/hooks/pre-commit
        print_success "Git hooks set up"
    else
        print_warning "Not a Git repository, skipping Git hooks setup"
    fi
}

# Compile smart contracts
compile_contracts() {
    print_status "Compiling smart contracts..."
    npm run compile
    print_success "Smart contracts compiled"
}

# Print setup completion message
print_completion() {
    echo ""
    print_success "🎉 Environment setup completed!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Update your .env file with actual configuration values"
    echo "2. Set up Firebase project at https://console.firebase.google.com/"
    echo "3. Get WalletConnect project ID at https://cloud.walletconnect.com/"
    echo "4. Deploy smart contracts: npm run deploy"
    echo "5. Start development server: npm run dev"
    echo ""
    echo "📚 Documentation:"
    echo "- README.md for detailed setup instructions"
    echo "- Firebase setup guide in the docs"
    echo "- Smart contract deployment guide"
    echo ""
    print_status "Happy coding! 🚀"
}

# Main setup process
main() {
    print_status "Starting environment setup..."
    
    check_node
    check_npm
    install_deps
    setup_env_file
    setup_git_hooks
    compile_contracts
    print_completion
}

# Run main function
main "$@"