// Значки погоды по коду WMO (поле weather_code в Open-Meteo): солнце, облачно, дождь, снег.
// Однотонный SVG в цвет текста — в тон газетной вёрстке, без цветных эмодзи.
export type WeatherKind = "sun" | "cloud" | "rain" | "snow";

export function weatherKind(code: number | null | undefined): WeatherKind | null {
  if (code === null || code === undefined || Number.isNaN(code)) return null;
  if (code <= 1) return "sun";
  if (code <= 3 || code === 45 || code === 48) return "cloud";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  return null;
}

const CLOUD = "M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 11.1 3.5 3.5 0 0 0 7 18z";
const SMALL_CLOUD = "M7 14h10a3.5 3.5 0 0 0 .5-6.96A5.5 5.5 0 0 0 6.3 8.2 3 3 0 0 0 7 14z";
const SHAPES: Record<WeatherKind, [string, string]> = {
  sun: ["ясно", '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>'],
  cloud: ["облачно", `<path d="${CLOUD}"/>`],
  rain: ["дождь", `<path d="${SMALL_CLOUD}"/><path d="M9 17l-1 3M13 17l-1 3M17 17l-1 3"/>`],
  snow: ["снег", `<path d="${SMALL_CLOUD}"/><path d="M8 18.5h.01M12 18.5h.01M16 18.5h.01M10 21h.01M14 21h.01" stroke-width="2.4"/>`],
};

export function weatherIcon(code: number | null | undefined): string {
  const k = weatherKind(code);
  if (!k) return "";
  const [label, body] = SHAPES[k];
  return `<svg class="wx" viewBox="0 0 24 24" width="1.4em" height="1.4em" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${label}">${body}</svg>`;
}
