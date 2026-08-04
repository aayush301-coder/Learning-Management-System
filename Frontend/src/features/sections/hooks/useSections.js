import { useState, useCallback } from "react";
import {
  getSectionsByCourseRequest,
  createSectionRequest,
  updateSectionRequest,
  deleteSectionRequest,
} from "../api/sectionApi";

export function useSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSectionsByCourse = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getSectionsByCourseRequest(courseId);
      setSections(data?.data || []);
      return data?.data || [];
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load sections.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createSection = useCallback(async (courseId, payload) => {
    const { data } = await createSectionRequest(courseId, payload);
    return data?.data;
  }, []);

  const updateSection = useCallback(async (sectionId, payload) => {
    const { data } = await updateSectionRequest(sectionId, payload);
    return data?.data;
  }, []);

  const deleteSection = useCallback(async (sectionId) => {
    await deleteSectionRequest(sectionId);
  }, []);

  return { sections, loading, error, fetchSectionsByCourse, createSection, updateSection, deleteSection };
}

export default useSections;
