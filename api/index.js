import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/routes.js";

dotenv.config();

const corsConfig = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

const app = express();
app.options("", cors(corsConfig));
app.use(cors(corsConfig));
app.use(express.json());

// MongoDB connection with caching for serverless
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    cachedDb = conn;
    console.log("✅ MongoDB Connected");
    return conn;
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    throw err;
  }
};
app.get("/favicon.ico", (req, res) => res.status(204).end());

app.get("/", (_req, res) => {
  res.send("Server is running ✅");
});

app.use("/api", router);

// Export handler for Vercel
export default async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
