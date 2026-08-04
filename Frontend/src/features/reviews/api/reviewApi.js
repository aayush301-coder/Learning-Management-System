import api from "../../../api/axios";

export function getReviewsByCourseRequest(courseId) {
  return api.get(`/reviews/course/${courseId}`);
}

export function createReviewRequest(courseId, data) {
  return api.post(`/reviews/course/${courseId}`, data);
}

export function updateReviewRequest(reviewId, data) {
  return api.patch(`/reviews/${reviewId}`, data);
}

export function deleteReviewRequest(reviewId) {
  return api.delete(`/reviews/${reviewId}`);
}
