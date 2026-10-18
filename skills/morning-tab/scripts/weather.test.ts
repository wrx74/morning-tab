// bun test scripts/weather.test.ts — значки погоды по коду WMO из Open-Meteo.
import { expect, test } from "bun:test";
import { weatherIcon, weatherKind } from "./weather.ts";

test("ясно и преимущественно ясно → солнце", () => {
  expect([0, 1].map(weatherKind)).toEqual(["sun", "sun"]);
});

test("переменная облачность, пасмурно, туман → облачно", () => {
  expect([2, 3, 45, 48].map(weatherKind)).toEqual(["cloud", "cloud", "cloud", "cloud"]);
});

test("морось, дождь, ливень, ледяной дождь, гроза → дождь", () => {
  expect([51, 55, 56, 61, 65, 66, 67, 80, 82, 95, 96, 99].every((c) => weatherKind(c) === "rain")).toBe(true);
});

test("снег, снежные зёрна, снегопад → снег", () => {
  expect([71, 73, 75, 77, 85, 86].every((c) => weatherKind(c) === "snow")).toBe(true);
});

test("нет кода или неизвестный → null, значка нет", () => {
  expect([undefined, null, 42, NaN].map((c) => weatherKind(c as number))).toEqual([null, null, null, null]);
  expect(weatherIcon(undefined)).toBe("");
});

test("значок — однотонный SVG в цвет текста с подписью для экранных читалок", () => {
  const s = weatherIcon(71);
  expect(s).toStartWith('<svg class="wx"');
  expect(s).toContain('stroke="currentColor"');
  expect(s).toContain('aria-label="снег"');
  expect(weatherIcon(0)).toContain('aria-label="ясно"');
  expect(weatherIcon(3)).toContain('aria-label="облачно"');
  expect(weatherIcon(61)).toContain('aria-label="дождь"');
});
