// Formatting helpers used across the app.

/** Format a number as Indian Rupees, e.g. 125000 -> "₹1,25,000". */
export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Format a date as e.g. "03 Nov 2026". */
export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Today's date at midnight (for day-level comparisons). */
export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
