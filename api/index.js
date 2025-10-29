import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from '../routes/routes.js';

dotenv.config();

const app = express();

// Middleware

app.use(express.json());
app.use(cors());

// MongoDB Connection with better error handling
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

// Connect to DB before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Routes

app.use('/api', routes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Postman Clone API is running' });
});

app.listen(process.env.PORT || 6500, () => {
  console.log(`Server running on port ${process.env.PORT || 6500}`);
});