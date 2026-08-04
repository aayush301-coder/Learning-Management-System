import api from "../../../api/axios";

export function getStudentProgressRequest(courseId) {
  return api.get(`/progress/${courseId}`);
}

export function getAllMyProgressRequest() {
  return api.get("/progress/my-progress");
}

export function completeLessonRequest(courseId, lessonId) {
  return api.patch(`/progress/${courseId}/lesson/${lessonId}/complete`);
}

export function updateLastAccessedRequest(courseId, lessonId) {
  return api.patch(`/progress/${courseId}/last-accessed`, { lessonId });
}
