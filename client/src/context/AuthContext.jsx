import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    loadCurrentUser();
  }, []);

  const register = async (formData) => {
    const response = await api.post("/auth/register", formData);

    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);

    return response.data;
  };

  const login = async (formData) => {
    const response = await api.post("/auth/login", formData);

    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loadingUser,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}