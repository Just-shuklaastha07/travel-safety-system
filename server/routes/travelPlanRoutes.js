import express from "express";
import {
  createTravelPlan,
  getTravelPlans,
  getTravelPlanById,
  deleteTravelPlan,
} from "../controllers/travelPlanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(createTravelPlan)
  .get(getTravelPlans);

router
  .route("/:id")
  .get(getTravelPlanById)
  .delete(deleteTravelPlan);

export default router;