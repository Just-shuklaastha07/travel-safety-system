import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import riskRoutes from "./routes/riskRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/risk", riskRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Travel Safety API is running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => { 
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();