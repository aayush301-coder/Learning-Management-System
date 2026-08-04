import { useState, useCallback } from "react";
import {
  getAllCoursesRequest,
  getMyCoursesRequest,
  getCourseByIdRequest,
  createCourseRequest,
  updateCourseRequest,
  deleteCourseRequest,
  submitForReviewRequest,
  publishCourseRequest,
  unpublishCourseRequest,
  archiveCourseRequest,
  restoreCourseRequest,
} from "../api/courseApi";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllCoursesRequest(params);
      setCourses(data?.data?.courses || []);
      setPagination(data?.data?.pagination || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyCourses = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMyCoursesRequest(params);
      setCourses(data?.data?.courses || []);
      setPagination(data?.data?.pagination || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCourseById = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getCourseByIdRequest(courseId);
      setCourse(data?.data || null);
      return data?.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (payload) => {
    const { data } = await createCourseRequest(payload);
    return data?.data;
  }, []);

  const updateCourse = useCallback(async (courseId, payload) => {
    const { data } = await updateCourseRequest(courseId, payload);
    return data?.data;
  }, []);

  const deleteCourse = useCallback(async (courseId) => {
    await deleteCourseRequest(courseId);
  }, []);

  const submitForReview = useCallback(async (courseId) => {
    const { data } = await submitForReviewRequest(courseId);
    return data?.data;
  }, []);

  const publishCourse = useCallback(async (courseId) => {
    const { data } = await publishCourseRequest(courseId);
    return data?.data;
  }, []);

  const unpublishCourse = useCallback(async (courseId) => {
    const { data } = await unpublishCourseRequest(courseId);
    return data?.data;
  }, []);

  const archiveCourse = useCallback(async (courseId) => {
    const { data } = await archiveCourseRequest(courseId);
    return data?.data;
  }, []);

  const restoreCourse = useCallback(async (courseId) => {
    const { data } = await restoreCourseRequest(courseId);
    return data?.data;
  }, []);

  return {
    courses,
    pagination,
    course,
    loading,
    error,
    fetchCourses,
    fetchMyCourses,
    fetchCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    submitForReview,
    publishCourse,
    unpublishCourse,
    archiveCourse,
    restoreCourse,
  };
}

export default useCourses;
