const express = require('express');
const morgan = require('morgan');
const kycRouter = require('./routes/kycRouter');
const verificationRouter = require('./routes/verificationRouter');
const uploadRouter = require('./routes/uploadRouter');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(cors());

// 1) MIDDLEWARES
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' })); // Increased limit for photo uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add CORS middleware for frontend-backend communication
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-mac-address, x-device-fingerprint');
  next();
});

// 2) ROUTES
app.use('/api', uploadRouter);
app.use('/api/kyc', kycRouter);
app.use('/api/verification', verificationRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

module.exports = app;