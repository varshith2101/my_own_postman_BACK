const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
const routes = require('../routes/routes'); // path changed since now in /api
app.use('/api', routes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Postman Clone API is running' });
});

// Export instead of listen
module.exports = app;
