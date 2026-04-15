export function smartCategorize(description: string): string {
  const text = description.toLowerCase();

  if (text.includes("uber") || text.includes("lyft")) return "Transport";
  if (text.includes("walmart") || text.includes("target")) return "Shopping";
  if (text.includes("salary") || text.includes("payroll")) return "Income";
  if (text.includes("netflix") || text.includes("spotify")) return "Subscriptions";
  if (text.includes("rent")) return "Housing";
  if (text.includes("electric") || text.includes("water") || text.includes("gas")) return "Utilities";
  if (text.includes("amazon")) return "Shopping";

  return "Other";
}
