import { useState, useCallback } from "react";
import { updateOwnProfileRequest, uploadImageRequest } from "../api/profileApi";

export function useProfile() {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const updateProfile = useCallback(async (data) => {
    setSaving(true);
    try {
      const response = await updateOwnProfileRequest(data);
      return response.data?.data;
    } finally {
      setSaving(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file) => {
    setUploading(true);
    try {
      const response = await uploadImageRequest(file);
      return response.data?.data?.url;
    } finally {
      setUploading(false);
    }
  }, []);

  return { saving, uploading, updateProfile, uploadAvatar };
}

export default useProfile;
