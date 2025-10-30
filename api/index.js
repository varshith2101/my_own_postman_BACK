import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "../routes/routes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use ("/api", router);
// ✅ Replace with your own
const mongoURI = process.env.MONGO_URI || "mongodb+srv://varsdevonline_db_user:JPsK3NjEFFjaMNCk@postman.pspwc1w.mongodb.net/?appName=postman";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// const PORT = process.env.PORT || 6500;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
