/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/authApi";
import { getErrorMessage } from "../utils/errorHandler";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token and fetch user on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("findit_token");
      if (token) {
        try {
          const response = await authApi.getCurrentUser();
          if (response.success && response.data?.user) {
            setUser(response.data.user);
          } else {
            // Invalid token, clear it
            localStorage.removeItem("findit_token");
            localStorage.removeItem("findit_user");
          }
        } catch {
          // Token expired or invalid, clear it
          localStorage.removeItem("findit_token");
          localStorage.removeItem("findit_user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const register = async (name, email, password) => {
    console.log("AuthContext: register called", { name, email });
    try {
      const response = await authApi.register({ name, email, password });
      console.log("AuthContext: register API response", response);

      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        // Store token and user
        localStorage.setItem("findit_token", token);
        localStorage.setItem("findit_user", JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }
      throw new Error(response.message || "Registration failed");
    } catch (error) {
      console.error("AuthContext: register error", error);
      return {
        success: false,
        error: getErrorMessage(error) || error.message || "Registration failed",
        errors: error.errors || [],
      };
    }
  };

  const login = async (email, password) => {
    console.log("AuthContext: login called", { email });
    try {
      const response = await authApi.login(email, password);
      console.log("AuthContext: login API response", response);

      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        // Store token and user
        localStorage.setItem("findit_token", token);
        localStorage.setItem("findit_user", JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }
      throw new Error(response.message || "Login failed");
    } catch (error) {
      console.error("AuthContext: login error", error);
      const errorMessage = getErrorMessage(error);
      console.log("AuthContext: extracted error message", errorMessage);
      return {
        success: false,
        error: errorMessage || error.message || "Login failed",
        errors: error.errors || [],
      };
    }
  };

  const googleLogin = async (token) => {
    console.log("AuthContext: googleLogin called");
    try {
      const response = await authApi.googleLogin(token);
      console.log("AuthContext: googleLogin API response", response);

      if (response.success && response.data) {
        const { user: userData, token: authToken } = response.data;
        localStorage.setItem("findit_token", authToken);
        localStorage.setItem("findit_user", JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      }
      throw new Error(response.message || "Google Login failed");
    } catch (error) {
      console.error("AuthContext: googleLogin error", error);
      return {
        success: false,
        error: getErrorMessage(error) || "Google Login failed",
      };
    }
  };

  const logout = () => {
    console.log("AuthContext: logout called");
    setUser(null);
    localStorage.removeItem("findit_token");
    localStorage.removeItem("findit_user");
  };



  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
