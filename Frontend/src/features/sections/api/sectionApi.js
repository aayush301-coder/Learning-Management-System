import api from "../../../api/axios";

export function getSectionsByCourseRequest(courseId) {
  return api.get(`/sections/course/${courseId}`);
}

export function createSectionRequest(courseId, data) {
  return api.post(`/sections/course/${courseId}`, data);
}

export function updateSectionRequest(sectionId, data) {
  return api.patch(`/sections/${sectionId}`, data);
}

export function deleteSectionRequest(sectionId) {
  return api.delete(`/sections/${sectionId}`);
}
