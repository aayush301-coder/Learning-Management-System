import api from "../../../api/axios";

export function getLessonsBySectionRequest(sectionId) {
  return api.get(`/lessons/section/${sectionId}`);
}

export function createLessonRequest(sectionId, data) {
  return api.post(`/lessons/section/${sectionId}`, data);
}

export function updateLessonRequest(lessonId, data) {
  return api.patch(`/lessons/${lessonId}`, data);
}

export function deleteLessonRequest(lessonId) {
  return api.delete(`/lessons/${lessonId}`);
}
