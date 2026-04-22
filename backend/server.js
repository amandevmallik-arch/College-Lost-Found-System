// Entry point for the backend server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

const app = express();

// ===== Global middleware =====
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== Connect to MongoDB =====
connectDB(process.env.MONGODB_URI);

// ===== Health check =====
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ===== API routes =====
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/lost', require('./routes/lostItemRoutes'));
app.use('/api/found', require('./routes/foundItemRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));


// =====================================================
//           SERVE FRONTEND WEBSITE (IMPORTANT)
// =====================================================

// absolute path to frontend folder
const frontendPath = path.join(__dirname, '..', 'frontend');

// serve all static frontend files (html, css, js, images)
app.use(express.static(frontendPath));

// open homepage on localhost:5000
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
