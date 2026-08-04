import { useState, useCallback } from "react";
import {
  getReviewsByCourseRequest,
  createReviewRequest,
  updateReviewRequest,
  deleteReviewRequest,
} from "../api/reviewApi";

export function useReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviewsByCourse = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getReviewsByCourseRequest(courseId);
      setReviews(data?.data || []);
      return data?.data || [];
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reviews.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createReview = useCallback(async (courseId, payload) => {
    const { data } = await createReviewRequest(courseId, payload);
    return data?.data;
  }, []);

  const updateReview = useCallback(async (reviewId, payload) => {
    const { data } = await updateReviewRequest(reviewId, payload);
    return data?.data;
  }, []);

  const deleteReview = useCallback(async (reviewId) => {
    await deleteReviewRequest(reviewId);
  }, []);

  return { reviews, loading, error, fetchReviewsByCourse, createReview, updateReview, deleteReview };
}

export default useReviews;
