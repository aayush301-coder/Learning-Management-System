import { useState, useCallback } from "react";
import {
  getLessonsBySectionRequest,
  createLessonRequest,
  updateLessonRequest,
  deleteLessonRequest,
} from "../api/lessonApi";

export function useLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLessonsBySection = useCallback(async (sectionId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getLessonsBySectionRequest(sectionId);
      setLessons(data?.data || []);
      return data?.data || [];
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load lessons.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createLesson = useCallback(async (sectionId, payload) => {
    const { data } = await createLessonRequest(sectionId, payload);
    return data?.data;
  }, []);

  const updateLesson = useCallback(async (lessonId, payload) => {
    const { data } = await updateLessonRequest(lessonId, payload);
    return data?.data;
  }, []);

  const deleteLesson = useCallback(async (lessonId) => {
    await deleteLessonRequest(lessonId);
  }, []);

  return { lessons, loading, error, fetchLessonsBySection, createLesson, updateLesson, deleteLesson };
}

export default useLessons;
