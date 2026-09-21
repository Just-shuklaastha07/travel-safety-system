const calculateWeatherRisk = (weather) => {
  let score = 10;
  const reasons = [];

  const temperature = weather.main.temp;
  const windSpeed = weather.wind.speed;
  const condition = weather.weather[0].main.toLowerCase();

  if (temperature >= 45 || temperature <= -10) {
    score += 45;
    reasons.push("Extreme temperature");
  } else if (temperature >= 38 || temperature <= 0) {
    score += 25;
    reasons.push("Potentially unsafe temperature");
  }

  if (windSpeed >= 20) {
    score += 35;
    reasons.push("Dangerously strong winds");
  } else if (windSpeed >= 10) {
    score += 20;
    reasons.push("Strong winds");
  }

  if (
    condition.includes("thunderstorm") ||
    condition.includes("tornado")
  ) {
    score += 45;
    reasons.push("Severe storm conditions");
  } else if (
    condition.includes("rain") ||
    condition.includes("snow")
  ) {
    score += 20;
    reasons.push("Rain or snowfall may disrupt travel");
  }

  score = Math.min(score, 100);

  let level = "Low";

  if (score >= 67) {
    level = "High";
  } else if (score >= 34) {
    level = "Moderate";
  }

  return {
    score,
    level,
    reasons:
      reasons.length > 0
        ? reasons
        : ["No major weather risk detected"],
  };
};

export const fetchWeatherRisk = async (destination) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenWeather API key is not configured");
  }

  const url =
    "https://api.openweathermap.org/data/2.5/weather" +
    `?q=${encodeURIComponent(destination)}` +
    `&appid=${apiKey}` +
    "&units=metric";

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 404) {
      const error = new Error("Destination not found");
      error.statusCode = 404;
      throw error;
    }

    const error = new Error(
      data.message || "Unable to retrieve weather information"
    );

    error.statusCode = response.status;
    throw error;
  }

  const risk = calculateWeatherRisk(data);

  return {
    destination: {
      city: data.name,
      country: data.sys.country,
      latitude: data.coord.lat,
      longitude: data.coord.lon,
    },

    currentWeather: {
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    },

    weatherRisk: risk,

    source: {
      name: "OpenWeather",
      updatedAt: new Date(data.dt * 1000).toISOString(),
    },
  };
};