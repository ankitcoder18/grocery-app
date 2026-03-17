# GroceryMart - Smart Grocery Price Comparison App

A full-stack web application to compare grocery prices across different vendors (Mall, Online, Local) and track your expenses.

## 🌟 Features

- **Price Comparison**: Compare prices across Mall, Online, and Local vendors
- **Search**: Quick search for grocery items
- **Dashboard**: Overview of spending patterns and price distribution
- **Price Comparison Charts**: Visual comparison of prices
- **Expense Tracking**: Track monthly grocery expenses
- **Best Price Detection**: Automatic identification of best deals
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Beautiful UI with Framer Motion animations

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Setup Instructions

### 1. Install MongoDB

**Option A: Local MongoDB**
- Download and install from [mongodb.com](https://www.mongodb.com/try/download/community)
- Make sure MongoDB service is running

**Option B: MongoDB Atlas (Cloud)**
- Create an account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get your connection string
- Update `server/.env` with your connection string

### 2. Backend Setup

```bash
# Navigate to root directory
cd grocery-app

# Install backend dependencies
npm install

# Navigate to server
cd server

# Seed the database with sample data
node scripts/seedData.js

# Start the backend server
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal
cd grocery-app/client

# Install frontend dependencies
npm install

# Start the frontend development server
npm start
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
grocery-app/
├── server/
│   ├── models/
│   │   ├── GroceryItem.js
│   │   └── Expense.js
│   ├── routes/
│   │   ├── groceryRoutes.js
│   │   └── expenseRoutes.js
│   ├── config/
│   │   └── db.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Navigation.js
│   │   │   ├── SearchBar.js
│   │   │   ├── GroceryCard.js
│   │   │   ├── GroceryList.js
│   │   │   ├── Dashboard.js
│   │   │   ├── PriceComparison.js
│   │   │   └── Footer.js
│   │   ├── api/
│   │   │   └── groceryApi.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── package.json
```

## 🛠️ Environment Variables

### server/.env
```
MONGODB_URI=mongodb://localhost:27017/grocery-app
NODE_ENV=development
PORT=5000
```

## 📊 API Endpoints

### Grocery Items
- `GET /api/groceries` - Get all items
- `GET /api/groceries/search?query=rice` - Search items
- `GET /api/groceries/:id` - Get single item
- `POST /api/groceries` - Create item
- `PATCH /api/groceries/:id` - Update item
- `DELETE /api/groceries/:id` - Delete item
- `GET /api/groceries/prices/summary` - Get price summary

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/summary/monthly` - Get monthly summary
- `POST /api/expenses` - Create expense record
- `PATCH /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

## 🎯 How to Use

### 1. View Dashboard
- Navigate to the Dashboard tab
- See total items, expenses, and price distribution
- View monthly expense trends

### 2. Search for Items
- Go to "All Items" tab
- Use the search bar to find items
- Filter by price source (Mall, Online, Local)
- Toggle between grid and list view

### 3. Compare Prices
- Click on "Price Comparison" tab
- View savings summary
- See which vendors offer the best prices
- Analyze price trends

### 4. Add New Items
- Use the API to add new items with prices
- Or seed the database with sample data

## 🎨 Technologies Used

**Frontend:**
- React 18
- Tailwind CSS
- Framer Motion (animations)
- Recharts (data visualization)
- React Icons
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose

## 📦 Key Features Explained

### Smart Price Detection
The app automatically finds the cheapest option among Mall, Online, and Local vendors for each item.

### Expense Tracking
Track your monthly grocery spending and see trends over time with interactive charts.

### Responsive Design
Fully responsive design that works on all devices using Tailwind CSS.

### Beautiful Animations
Smooth page transitions and component animations using Framer Motion.

## 🚀 Deployment

### Backend (Heroku, Railway, Render)
1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy

### Frontend (Vercel, Netlify)
1. Build: `cd client && npm run build`
2. Deploy the `build` folder
3. Update API_BASE_URL in `.env`

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify firewall settings (for Atlas)

**Port Already in Use**
- Change PORT in `.env`
- Kill process: `lsof -ti:5000 | xargs kill -9`

**Module Not Found**
- Delete `node_modules` folder
- Run `npm install` again

## 📝 Sample Data

The app comes with pre-loaded sample grocery data including:
- Rice, Wheat flour, Poha, Sooji, and more
- Prices from Mall, Online, and Local vendors
- Real expense data from your sheet

## 🤝 Contributing

Feel free to fork, modify, and use this project for your own needs!

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips for Best Results

1. Keep MongoDB running in background
2. Start backend server first, then frontend
3. Use Chrome DevTools for debugging
4. Check console for any error messages
5. Ensure both servers are running before using the app

## 🎉 Enjoy!

Start comparing prices and save money on your grocery shopping!

For questions or issues, please check the console logs and ensure all services are running correctly.
