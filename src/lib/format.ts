export function formatDate(date: string, locale = "en-US") {
  if (!date) return "";
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: locale.startsWith("zh") ? "long" : "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
