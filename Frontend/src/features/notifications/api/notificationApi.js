import api from "../../../api/axios";

export function getMyNotificationsRequest(params = {}) {
  return api.get("/notifications", { params });
}

export function markNotificationAsReadRequest(notificationId) {
  return api.patch(`/notifications/${notificationId}/read`);
}

export function markAllNotificationsAsReadRequest() {
  return api.patch("/notifications/mark-all-read");
}
