#!/bin/bash

echo "🚀 Launching PRODIGY Employee Management System..."
echo "=================================================="

# Create project structure
echo "📁 Creating project structure..."
mkdir -p backend/{config,models,routes,controllers,middleware,utils}
mkdir -p frontend/src/{components,pages,context,services}
mkdir -p frontend/public

# Backend Setup
echo "⚙️  Setting up backend..."
cd backend

# Create package.json
cat > package.json << 'EOF'
{
  "name": "employee-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js",
    "seed": "node utils/seedAdmin.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
EOF

# Install backend dependencies
npm install

# Create .env file
cat > .env << 'EOF'
PORT=5000
MONGO_URI=mongodb://localhost:27017/prodigy_employees
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
DEFAULT_ADMIN_PASSWORD=admin123
NODE_ENV=development
EOF

echo "✅ Backend dependencies installed"

# Frontend Setup
echo "⚙️  Setting up frontend..."
cd ../frontend

# Initialize Vite React project
npm create vite@latest . -- --template react --yes
npm install

# Install additional dependencies
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

echo "✅ Frontend dependencies installed"

# Return to root
cd ..

echo ""
echo "✨ Setup Complete!"
echo "=================================================="
echo "🎯 Next Steps:"
echo "1. Start MongoDB service"
echo "2. Backend: cd backend && npm run seed && npm run dev"
echo "3. Frontend: cd frontend && npm run dev"
echo "4. Access: http://localhost:5173"
echo ""
echo "🔐 Default Admin: admin / admin123"
echo "=================================================="