# 📖 Complete Installation & Setup Guide

## Quick Start (5 Minutes)

### Step 1: Extract the ZIP
```bash
unzip grocery-app.zip
cd grocery-app
```

### Step 2: Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 3: Setup MongoDB

**Choose One Option:**

#### Option A: Local MongoDB (Windows/Mac/Linux)

1. **Download MongoDB Community**
   - Go to https://www.mongodb.com/try/download/community
   - Select your OS and download the installer

2. **Install MongoDB**
   - Windows: Run installer and follow steps
   - Mac: `brew install mongodb-community` or use installer
   - Linux: `sudo apt-get install -y mongodb-org`

3. **Start MongoDB Service**
   - Windows: MongoDB will start automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

4. **Verify Installation**
   ```bash
   mongo --version
   # or
   mongosh --version
   ```

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with email
   - Create organization and project

2. **Create Cluster**
   - Click "Create a Cluster"
   - Choose free tier
   - Select your region
   - Click "Create Cluster"

3. **Get Connection String**
   - Go to "Databases"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/grocery-app?retryWrites=true&w=majority`

4. **Update Environment Variable**
   - Open `server/.env`
   - Replace `MONGODB_URI` with your connection string:
   ```
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster.mongodb.net/grocery-app?retryWrites=true&w=majority
   ```

### Step 4: Seed Sample Data

```bash
# Navigate to server directory
cd server

# Run seed script
node scripts/seedData.js

# You should see: "✅ Database seeding completed successfully!"
```

### Step 5: Start Backend Server

```bash
# From server directory
npm start

# You should see: "Server running on port 5000"
```

**Keep this terminal open!**

### Step 6: Start Frontend Server (New Terminal)

```bash
# From grocery-app directory (root)
cd client
npm start

# Frontend will open at http://localhost:3000
```

## ✅ Verification Checklist

- [ ] MongoDB is running (local or Atlas connected)
- [ ] Backend server running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Browser opened at http://localhost:3000
- [ ] Dashboard shows items and charts
- [ ] Can search for items
- [ ] Can see price comparisons

## 🌐 API Testing

Test if API is working:

```bash
# In browser or Postman, visit:
http://localhost:5000/api/health

# Should return: {"status":"Server is running"}

# Get all items:
http://localhost:5000/api/groceries
```

## 📱 Using the Application

### Dashboard Tab
- Overview of all grocery items
- Total expenses chart
- Price source distribution pie chart
- Monthly expense trends

### All Items Tab
- Search items by name (e.g., "rice", "wheat")
- Filter by price source (Mall, Online, Local)
- Switch between Grid and List view
- Click on items to see detailed pricing

### Price Comparison Tab
- View total savings summary
- See which vendor has the best deals
- Bar chart comparing prices
- Shopping recommendations

## 🔧 Troubleshooting

### "MongoDB connection error"
```bash
# Check if MongoDB is running
# Windows: Check Services or Task Manager
# Mac: brew services list
# Linux: sudo systemctl status mongod

# If using Atlas, verify:
# 1. Connection string is correct
# 2. Password doesn't have special characters (URL encode if needed)
# 3. Your IP is whitelisted in Atlas
# 4. Internet connection is working
```

### "Port 5000 already in use"
```bash
# Find process using port 5000
# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Windows (PowerShell as Admin):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

### "Port 3000 already in use"
```bash
# Kill process
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### "npm install fails"
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### "Cannot find module" error
```bash
# In both root and client directory:
rm -rf node_modules
npm install

# Make sure you're in correct directory
pwd  # Check current directory
```

### "Database is empty"
```bash
# Reseed the data
cd server
node scripts/seedData.js
```

## 🚀 Production Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Prepare**
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   ```

2. **Create Account**
   - Go to Render.com or Railway.app
   - Connect GitHub repository

3. **Configure Environment**
   - Add `MONGODB_URI` env variable
   - Set `NODE_ENV=production`

4. **Deploy**
   - Platform will auto-deploy on push

### Frontend Deployment (Vercel/Netlify)

1. **Build**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy Build Folder**
   - Vercel: Connect GitHub, auto-deploys
   - Netlify: Drag & drop build folder

3. **Update API URL**
   - In `client/src/api/groceryApi.js`
   - Change `http://localhost:5000` to deployed backend URL

## 📚 File Structure

```
grocery-app/
├── server/                 # Backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── config/            # Configuration
│   ├── scripts/           # Seed data
│   ├── server.js          # Main server file
│   ├── .env               # Environment variables
│   └── package.json       # Dependencies
│
├── client/                # Frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── api/           # API calls
│   │   ├── utils/         # Helper functions
│   │   ├── App.js         # Main App
│   │   └── index.js       # Entry point
│   ├── tailwind.config.js # Tailwind config
│   └── package.json       # Dependencies
│
├── README.md              # Project overview
├── INSTALLATION.md        # This file
└── package.json           # Root package.json
```

## 💡 Common Commands

```bash
# Start backend (from root)
cd server && npm start

# Start backend with auto-reload (from root)
cd server && npm run dev

# Start frontend (from root)
cd client && npm start

# Build frontend (from root)
cd client && npm run build

# Seed database
cd server && node scripts/seedData.js

# Access MongoDB CLI (local)
mongosh

# Check MongoDB status
systemctl status mongod  # Linux
brew services list      # Mac
```

## 🎯 Next Steps

1. ✅ Complete installation
2. 🚀 Run the application
3. 📊 Explore the features
4. 🛠️ Customize for your needs
5. 📝 Add your own data
6. 🌍 Deploy to production

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review console logs (F12 in browser)
3. Verify all services are running
4. Check terminal for error messages
5. Ensure ports 5000 and 3000 are free

## ✨ Features Overview

- ✅ Search & filter groceries
- ✅ Compare prices across vendors
- ✅ Track monthly expenses
- ✅ Beautiful charts & analytics
- ✅ Mobile responsive
- ✅ Real-time updates
- ✅ Data persistence

Enjoy your grocery price comparison app! 🎉
