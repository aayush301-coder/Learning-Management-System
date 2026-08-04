// Keep these in sync with Backend/src/constants/course.constants.js
export const COURSE_CATEGORIES = [
  "development",
  "design",
  "business",
  "marketing",
  "it-and-software",
  "personal-development",
  "photography",
  "music",
];

export const COURSE_LEVELS = ["beginner", "intermediate", "advanced"];

export const COURSE_LANGUAGES = ["english", "hindi", "spanish", "french", "german"];

export const COURSE_STATUSES = [
  "draft",
  "pending_review",
  "published",
  "unpublished",
  "archived",
];

export const COURSE_STATUS_BADGES = {
  draft: { label: "Draft", variant: "secondary" },
  pending_review: { label: "Pending Review", variant: "warning" },
  published: { label: "Published", variant: "success" },
  unpublished: { label: "Unpublished", variant: "neutral" },
  archived: { label: "Archived", variant: "danger" },
};

export function formatConstantLabel(value) {
  if (!value) return "";

  return value
    .split("-")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
