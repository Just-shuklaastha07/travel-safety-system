import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [destination, setDestination] = useState("");
  const [riskData, setRiskData] = useState(null);
  const [error, setError] = useState("");
  const [searching, setSearching] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError("");
    setRiskData(null);

    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }

    try {
      setSearching(true);

      const response = await api.get("/risk/search", {
        params: {
          destination: destination.trim(),
        },
      });

      setRiskData(response.data.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to retrieve destination risk information"
      );
    } finally {
      setSearching(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-brand">TravelSafe</p>
          <h1>Safety Risk Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <section className="search-section">
        <div>
          <h2>Where are you travelling?</h2>
          <p>
            Search a city to view its current weather and travel-risk
            assessment.
          </p>
        </div>

        <form className="destination-form" onSubmit={handleSearch}>
          <input
            type="text"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Enter city, for example Delhi"
          />

          <button type="submit" disabled={searching}>
            {searching ? "Checking..." : "Check safety"}
          </button>
        </form>

        {error && <div className="dashboard-error">{error}</div>}
      </section>

      {!riskData && !searching && (
        <section className="empty-dashboard">
          <div className="empty-icon">⌖</div>
          <h2>Search for a destination</h2>
          <p>
            Weather conditions and safety information will appear here.
          </p>
        </section>
      )}

      {riskData && (
        <section className="risk-results">
          <div className="destination-heading">
            <div>
              <p>Current assessment</p>
              <h2>
                {riskData.destination.city},{" "}
                {riskData.destination.country}
              </h2>
            </div>

            <div
              className={`risk-badge ${riskData.weatherRisk.level.toLowerCase()}`}
            >
              <span>{riskData.weatherRisk.score}/100</span>
              <strong>{riskData.weatherRisk.level} risk</strong>
            </div>
          </div>

          <div className="risk-grid">
            <article className="dashboard-card weather-card">
              <div className="card-heading">
                <div>
                  <p className="card-label">Current weather</p>
                  <h3>
                    {Math.round(
                      riskData.currentWeather.temperature
                    )}
                    °C
                  </h3>
                </div>

                <img
                  src={`https://openweathermap.org/img/wn/${riskData.currentWeather.icon}@2x.png`}
                  alt={riskData.currentWeather.description}
                />
              </div>

              <p className="weather-description">
                {riskData.currentWeather.description}
              </p>

              <div className="weather-details">
                <div>
                  <span>Feels like</span>
                  <strong>
                    {Math.round(
                      riskData.currentWeather.feelsLike
                    )}
                    °C
                  </strong>
                </div>

                <div>
                  <span>Humidity</span>
                  <strong>
                    {riskData.currentWeather.humidity}%
                  </strong>
                </div>

                <div>
                  <span>Wind speed</span>
                  <strong>
                    {riskData.currentWeather.windSpeed} m/s
                  </strong>
                </div>
              </div>
            </article>

            <article className="dashboard-card">
              <p className="card-label">Weather risk analysis</p>

              <h3>{riskData.weatherRisk.level} risk</h3>

              <ul className="risk-reasons">
                {riskData.weatherRisk.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </article>

            <article className="dashboard-card">
              <p className="card-label">Location</p>

              <h3>{riskData.destination.city}</h3>

              <div className="location-details">
                <p>
                  Latitude: {riskData.destination.latitude}
                </p>
                <p>
                  Longitude: {riskData.destination.longitude}
                </p>
              </div>
            </article>
          </div>

          <p className="source-note">
            Source: {riskData.source.name} · Updated{" "}
            {new Date(
              riskData.source.updatedAt
            ).toLocaleString()}
          </p>

          <div className="safety-disclaimer">
            This assessment provides informational guidance and does not
            guarantee traveller safety. Always check official local
            advisories before travelling.
          </div>
        </section>
      )}
    </main>
  );
}

export default Dashboard;