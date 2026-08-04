import api from "../../../api/axios";

export function getDashboardStatsRequest() {
  return api.get("/dashboard/stats");
}

export function getPopularCoursesRequest() {
  return api.get("/dashboard/popular-courses");
}

export function getRecentActivityRequest() {
  return api.get("/dashboard/activity");
}
