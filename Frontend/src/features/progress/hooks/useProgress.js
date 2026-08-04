import { useState, useCallback } from "react";
import {
  getStudentProgressRequest,
  completeLessonRequest,
  updateLastAccessedRequest,
} from "../api/progressApi";

export function useProgress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProgress = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getStudentProgressRequest(courseId);
      setProgress(data?.data || null);
      return data?.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load progress.");
    } finally {
      setLoading(false);
    }
  }, []);

  const completeLesson = useCallback(async (courseId, lessonId) => {
    const { data } = await completeLessonRequest(courseId, lessonId);
    setProgress(data?.data);
    return data?.data;
  }, []);

  const updateLastAccessed = useCallback(async (courseId, lessonId) => {
    const { data } = await updateLastAccessedRequest(courseId, lessonId);
    return data?.data;
  }, []);

  return { progress, loading, error, fetchProgress, completeLesson, updateLastAccessed };
}

export default useProgress;
