import api from "../../../api/axios";

export function registerRequest(data) {
  return api.post("/auth/register", data);
}

export function loginRequest(data) {
  return api.post("/auth/login", data);
}

export function getCurrentUserRequest() {
  return api.get("/auth/me");
}
