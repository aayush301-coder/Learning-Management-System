import api from "../../../api/axios";

export function getAllCoursesRequest(params = {}) {
  return api.get("/courses", { params });
}

export function getMyCoursesRequest(params = {}) {
  return api.get("/courses/my-courses", { params });
}

export function getCourseByIdRequest(courseId) {
  return api.get(`/courses/${courseId}`);
}

export function createCourseRequest(data) {
  return api.post("/courses", data);
}

export function updateCourseRequest(courseId, data) {
  return api.patch(`/courses/${courseId}`, data);
}

export function deleteCourseRequest(courseId) {
  return api.delete(`/courses/${courseId}`);
}

export function submitForReviewRequest(courseId) {
  return api.patch(`/courses/${courseId}/submit-for-review`);
}

export function publishCourseRequest(courseId) {
  return api.patch(`/courses/${courseId}/publish`);
}

export function unpublishCourseRequest(courseId) {
  return api.patch(`/courses/${courseId}/unpublish`);
}

export function archiveCourseRequest(courseId) {
  return api.patch(`/courses/${courseId}/archive`);
}

export function restoreCourseRequest(courseId) {
  return api.patch(`/courses/${courseId}/restore`);
}
