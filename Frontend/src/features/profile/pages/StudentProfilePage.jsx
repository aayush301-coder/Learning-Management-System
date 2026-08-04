import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Calendar, Shield, Pencil, Save, Camera } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../auth/hooks/useAuth";
import { useProfile } from "../hooks/useProfile";

import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import { formatDate, formatRoleName } from "../../../utils/formatters";

const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  email: z.string().email("Valid email required"),
  avatar: z.string().optional(),
});

function StudentProfilePage() {
  const { user, updateUser } = useAuth();
  const { saving, uploading, updateProfile, uploadAvatar } = useProfile();
  const fileInputRef = useRef(null);
  const nameInputRef = useRef(null);

  const defaultValues = useMemo(
    () => ({ name: user?.name || "", email: user?.email || "", avatar: user?.avatar || "" }),
    [user]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(profileSchema), defaultValues });

  const { ref: nameRegisterRef, ...nameRegisterProps } = register("name");
  const avatarValue = watch("avatar");

  useEffect(() => {
    if (user) reset(defaultValues);
  }, [user, defaultValues, reset]);

  const onSubmit = async (data) => {
    try {
      const updated = await updateProfile({ name: data.name });
      updateUser(updated);
      toast.success("Profile saved successfully.");
    } catch (err) {
      const message =
        err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Failed to save profile.";
      toast.error(message);
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadAvatar(file);
      if (url) {
        setValue("avatar", url);
        const updated = await updateProfile({ avatar: url });
        updateUser(updated);
        toast.success("Avatar updated.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload avatar.");
    } finally {
      e.target.value = "";
    }
  };

  const handleEditIconClick = () => nameInputRef.current?.focus();

  if (!user) {
    return <div className="py-10 text-center text-sm text-ink-soft">Please login to view your profile.</div>;
  }

  const roleName = formatRoleName(user.role);
  const initials = (user.name || user.email || "?").charAt(0).toUpperCase();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="relative lg:col-span-1">
        <button
          type="button"
          onClick={handleEditIconClick}
          aria-label="Edit profile"
          title="Edit profile"
          className="absolute right-4 top-4 rounded-full p-2 text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center p-8 text-center">
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-ink to-inkblue text-3xl font-bold text-white shadow-lg">
              {avatarValue ? (
                <img src={avatarValue} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>

            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploading}
              aria-label="Upload avatar"
              title="Upload avatar"
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-highlighter text-ink shadow-md transition-transform hover:scale-105 disabled:opacity-60"
            >
              <Camera className="h-4 w-4" />
            </button>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>

          {uploading && <p className="mt-2 text-xs text-ink-soft">Uploading avatar...</p>}

          <h2 className="mt-4 text-xl font-bold text-ink">{user.name || "Unnamed User"}</h2>
          <p className="text-sm text-ink-soft">{user.email}</p>
          <div className="mt-3">
            <Badge variant={user.role === "admin" ? "danger" : user.role === "instructor" ? "warning" : "default"}>
              <Shield className="mr-1 h-3 w-3 inline" />
              {roleName}
            </Badge>
          </div>

          <div className="mt-8 w-full space-y-3 border-t border-ink/10 pt-6 text-left">
            <div className="flex items-start gap-3 text-sm">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft" />
              <div>
                <p className="font-semibold text-ink-soft">Joined On</p>
                <p className="text-ink">{formatDate(user.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ink-soft" />
              <div>
                <p className="font-semibold text-ink-soft">Email</p>
                <p className="text-ink">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
              <Pencil className="h-5 w-5 text-inkblue" />
              Edit Profile
            </h3>
            <p className="mt-1 text-sm text-ink-soft">Update your personal information and display preferences.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Full Name *"
                placeholder="e.g. John Doe"
                {...nameRegisterProps}
                ref={(el) => {
                  nameRegisterRef(el);
                  nameInputRef.current = el;
                }}
                error={errors.name?.message}
              />
              <Input label="Email Address" disabled {...register("email")} error={errors.email?.message} />
            </div>

            <p className="text-xs text-ink-soft">
              Use the camera icon on your avatar to upload a new profile picture — it saves automatically.
            </p>

            <div className="flex justify-end border-t border-ink/10 pt-3">
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default StudentProfilePage;
