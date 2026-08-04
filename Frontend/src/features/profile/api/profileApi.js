import api from "../../../api/axios";

export function getAllUsersRequest(params = {}) {
  return api.get("/users", { params });
}

export function updateOwnProfileRequest(data) {
  return api.patch("/users/me", data);
}

export function uploadImageRequest(file) {
  const formData = new FormData();
  formData.append("image", file);

  return api.post("/uploads/image", formData, {
    headers: { "Content-Type": undefined },
  });
}
