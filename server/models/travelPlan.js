import mongoose from "mongoose";

const travelPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      city: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        required: true,
        trim: true,
      },

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    alertPreferences: {
      weather: {
        type: Boolean,
        default: true,
      },

      health: {
        type: Boolean,
        default: true,
      },

      political: {
        type: Boolean,
        default: true,
      },

      disaster: {
        type: Boolean,
        default: true,
      },
    },

    riskSnapshot: {
      weatherScore: {
        type: Number,
        min: 0,
        max: 100,
      },

      weatherLevel: {
        type: String,
        enum: ["Low", "Moderate", "High"],
      },
    },

    status: {
      type: String,
      enum: ["planned", "completed", "cancelled"],
      default: "planned",
    },
  },
  {
    timestamps: true,
  }
);

const TravelPlan = mongoose.model("TravelPlan", travelPlanSchema);

export default TravelPlan;