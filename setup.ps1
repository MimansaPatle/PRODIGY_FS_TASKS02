Write-Host "🚀 Launching PRODIGY Employee Management System..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Create project structure
Write-Host "📁 Creating project structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "backend\config", "backend\models", "backend\routes", "backend\controllers", "backend\middleware", "backend\utils" -Force | Out-Null
New-Item -ItemType Directory -Path "frontend\src\components", "frontend\src\pages", "frontend\src\context", "frontend\src\services", "frontend\public" -Force | Out-Null

# Backend Setup
Write-Host "⚙️  Setting up backend..." -ForegroundColor Yellow
Set-Location backend

# Create package.json
@'
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
'@ | Out-File -FilePath "package.json" -Encoding UTF8

# Install backend dependencies
npm install

# Create .env file
@'
PORT=5000
MONGO_URI=mongodb://localhost:27017/prodigy_employees
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
NODE_ENV=development
'@ | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Frontend Setup
Write-Host "⚙️  Setting up frontend..." -ForegroundColor Yellow
Set-Location ..\frontend

# Initialize Vite React project
npm create vite@latest . -- --template react --yes
npm install

# Install additional dependencies
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

# Return to root
Set-Location ..

Write-Host ""
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Start MongoDB service" -ForegroundColor White
Write-Host "2. Backend: cd backend; npm run seed; npm run dev" -ForegroundColor White
Write-Host "3. Frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host "4. Access: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Default Admin: admin / admin123" -ForegroundColor Magenta
Write-Host "==================================================" -ForegroundColor Cyan