import express from "express";
import { searchDestinationRisk } from "../controllers/riskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", protect, searchDestinationRisk);

export default router;