import { fetchWeatherRisk } from "../services/weatherService.js";

export const searchDestinationRisk = async (req, res) => {
  try {
    const destination = req.query.destination?.trim();

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Destination is required",
      });
    }

    const riskData = await fetchWeatherRisk(destination);

    return res.status(200).json({
      success: true,
      data: riskData,
    });
  } catch (error) {
    console.error("Destination risk error:", error.message);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.statusCode === 401
          ? "Weather service authentication failed"
          : error.message,
    });
  }
};