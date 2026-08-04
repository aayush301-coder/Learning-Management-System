import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "./AuthContext";
import { registerRequest, loginRequest, getCurrentUserRequest } from "../api/authApi";
import { getToken, setToken, removeToken } from "../../../utils/token";

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setAuthToken] = useState(() => getToken());
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const storedToken = getToken();

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await getCurrentUserRequest();
      setUser(response.data?.data);
    } catch {
      removeToken();
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = useCallback(async (data) => {
    const response = await registerRequest(data);
    return response.data;
  }, []);

  const login = useCallback(async (data) => {
    const response = await loginRequest(data);
    const { accessToken, user: loggedInUser } = response.data?.data || {};

    if (accessToken) {
      setToken(accessToken);
      setAuthToken(accessToken);
      setUser(loggedInUser);
    }

    return response.data;
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setAuthToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((partialUser) => {
    setUser((prev) => (prev ? { ...prev, ...partialUser } : prev));
  }, []);

  // If any API call comes back 401 (expired/invalid token), clear
  // auth state everywhere and send the user back to login.
  useEffect(() => {
    const handleUnauthorized = () => {
      setAuthToken(null);
      setUser(null);
      navigate("/login", { replace: true });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, loadUser, updateUser }),
    [user, token, loading, login, register, logout, loadUser, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
