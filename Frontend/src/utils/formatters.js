export function formatDate(dateString) {
  if (!dateString) return "—";

  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRoleName(role) {
  if (!role) return "";

  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function formatCurrency(amount) {
  const value = Number(amount) || 0;

  if (value === 0) return "Free";

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatStatusLabel(status) {
  if (!status) return "";

  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatDuration(minutes) {
  const value = Number(minutes) || 0;

  if (value < 60) return `${value} min`;

  const hours = Math.floor(value / 60);
  const remainingMinutes = value % 60;

  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}
