import { useState, useCallback } from "react";
import { enrollInCourseRequest, getMyEnrollmentsRequest, cancelEnrollmentRequest } from "../api/enrollmentApi";

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyEnrollments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMyEnrollmentsRequest();
      setEnrollments(data?.data || []);
      return data?.data || [];
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load enrollments.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const enrollInCourse = useCallback(async (courseId) => {
    const { data } = await enrollInCourseRequest(courseId);
    return data?.data;
  }, []);

  const cancelEnrollment = useCallback(async (courseId) => {
    await cancelEnrollmentRequest(courseId);
  }, []);

  return { enrollments, loading, error, fetchMyEnrollments, enrollInCourse, cancelEnrollment };
}

export default useEnrollments;
