import TravelPlan from "../models/travelPlan.js";

const validateDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return {
      valid: false,
      message: "Please provide valid travel dates",
    };
  }

  if (end < start) {
    return {
      valid: false,
      message: "End date cannot be before start date",
    };
  }

  return {
    valid: true,
    start,
    end,
  };
};

// POST /api/travel-plans
export const createTravelPlan = async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      alertPreferences,
      riskSnapshot,
    } = req.body;

    if (
      !destination?.city ||
      !destination?.country ||
      destination.latitude === undefined ||
      destination.longitude === undefined ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Destination and travel dates are required",
      });
    }

    const dateValidation = validateDates(startDate, endDate);

    if (!dateValidation.valid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.message,
      });
    }

    const travelPlan = await TravelPlan.create({
      user: req.user._id,

      destination: {
        city: destination.city.trim(),
        country: destination.country.trim(),
        latitude: destination.latitude,
        longitude: destination.longitude,
      },

      startDate: dateValidation.start,
      endDate: dateValidation.end,
      alertPreferences,
      riskSnapshot,
    });

    return res.status(201).json({
      success: true,
      message: "Travel plan saved successfully",
      data: travelPlan,
    });
  } catch (error) {
    console.error("Create travel plan error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save travel plan",
    });
  }
};

// GET /api/travel-plans
export const getTravelPlans = async (req, res) => {
  try {
    const travelPlans = await TravelPlan.find({
      user: req.user._id,
    }).sort({ startDate: 1 });

    return res.status(200).json({
      success: true,
      count: travelPlans.length,
      data: travelPlans,
    });
  } catch (error) {
    console.error("Get travel plans error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve travel plans",
    });
  }
};

// GET /api/travel-plans/:id
export const getTravelPlanById = async (req, res) => {
  try {
    const travelPlan = await TravelPlan.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!travelPlan) {
      return res.status(404).json({
        success: false,
        message: "Travel plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: travelPlan,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid travel plan ID",
    });
  }
};

// DELETE /api/travel-plans/:id
export const deleteTravelPlan = async (req, res) => {
  try {
    const travelPlan = await TravelPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!travelPlan) {
      return res.status(404).json({
        success: false,
        message: "Travel plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Travel plan deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid travel plan ID",
    });
  }
};