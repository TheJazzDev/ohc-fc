export function initialsFromName(name: string): string {
  const letters = name
    .replace(/\./g, "")
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "");
  return letters.slice(0, 2).join("") || "?";
}
