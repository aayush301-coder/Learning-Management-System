import api from "../../../api/axios";

export function enrollInCourseRequest(courseId) {
  return api.post(`/enrollments/${courseId}`);
}

export function getMyEnrollmentsRequest() {
  return api.get("/enrollments/my-enrollments");
}

export function cancelEnrollmentRequest(courseId) {
  return api.delete(`/enrollments/${courseId}`);
}
