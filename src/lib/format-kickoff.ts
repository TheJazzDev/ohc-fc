const ZONE = "Europe/London";

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, weekday: "long", day: "numeric", month: "long" }).format(
    date,
  );
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, weekday: "short", day: "numeric", month: "short" }).format(
    date,
  );
}

export function formatDay(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: ZONE, day: "2-digit" }).format(date);
}

export function formatTime(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  const dayPeriod = (parts.find((p) => p.type === "dayPeriod")?.value ?? "").toUpperCase();

  return `${hour}:${minute}${dayPeriod}`;
}

// Reads a `datetime-local` form value ("YYYY-MM-DDTHH:mm") as Europe/London wall-clock time.
export function parseLondonDateTimeLocal(value: string): Date {
  const utcGuess = new Date(`${value}:00Z`);
  const asLondon = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(utcGuess);

  const get = (type: string) => asLondon.find((p) => p.type === type)?.value ?? "00";
  const offsetMs =
    Date.UTC(
      Number(get("year")),
      Number(get("month")) - 1,
      Number(get("day")),
      Number(get("hour")),
      Number(get("minute")),
    ) - utcGuess.getTime();

  return new Date(utcGuess.getTime() - offsetMs);
}

// Formats a Date back into a `datetime-local` value in Europe/London wall-clock time.
export function toLondonDateTimeLocal(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}
