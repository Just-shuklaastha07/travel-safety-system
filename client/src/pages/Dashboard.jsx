import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main style={{ padding: "40px" }}>
      <h1>Travel Safety Dashboard</h1>

      <p style={{ marginTop: "12px" }}>
        Welcome, {user?.name}.
      </p>

      <p style={{ marginTop: "6px" }}>
        Your destination risk information will appear here.
      </p>

      <button
        type="button"
        onClick={handleLogout}
        style={{
          marginTop: "24px",
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          background: "#087f5b",
          color: "white",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </main>
  );
}

export default Dashboard;