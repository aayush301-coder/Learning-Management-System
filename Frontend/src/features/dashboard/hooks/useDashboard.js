import { useState, useCallback } from "react";
import { getDashboardStatsRequest, getPopularCoursesRequest, getRecentActivityRequest } from "../api/dashboardApi";

export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [popularCourses, setPopularCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, popularRes, activityRes] = await Promise.allSettled([
        getDashboardStatsRequest(),
        getPopularCoursesRequest(),
        getRecentActivityRequest(),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value.data?.data);
      if (popularRes.status === "fulfilled") setPopularCourses(popularRes.value.data?.data || []);
      if (activityRes.status === "fulfilled") setRecentActivity(activityRes.value.data?.data || []);

      if (statsRes.status === "rejected") {
        setError(statsRes.reason?.response?.data?.message || "Failed to load dashboard stats.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, popularCourses, recentActivity, loading, error, fetchDashboardData };
}

export default useDashboard;
