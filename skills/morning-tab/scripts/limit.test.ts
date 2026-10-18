// bun test scripts/limit.test.ts — отбор материалов по важности (minJev, maxItems).
import { expect, test } from "bun:test";
import { limitItems } from "./config.ts";

const it = (id: string, score: number, jev?: number) => ({ id, score, ...(jev === undefined ? {} : { jev: { score: jev, confidence: 1 } }) });

test("убирает материалы с jev ниже minJev", () => {
  const r = limitItems([it("a", 300, 3), it("b", 200, 0.5), it("c", 100, 1)], { minJev: 1 });
  expect(r.items.map((i) => i.id)).toEqual(["a", "c"]);
  expect(r.dropped).toBe(1);
});

test("оставляет не больше maxItems, самые весомые (вход уже отсортирован по score)", () => {
  const r = limitItems([it("a", 300, 2), it("b", 200, 2), it("c", 100, 2)], { maxItems: 2 });
  expect(r.items.map((i) => i.id)).toEqual(["a", "b"]);
  expect(r.dropped).toBe(1);
});

test("материал без оценки Jev (Jev не ответил) не отсеивается порогом", () => {
  expect(limitItems([it("a", 300), it("b", 200, 0.2)], { minJev: 1 }).items.map((i) => i.id)).toEqual(["a"]);
});

test("без minJev и maxItems ничего не меняется", () => {
  const xs = [it("a", 3, 0), it("b", 2, 0)];
  expect(limitItems(xs, {})).toEqual({ items: xs, dropped: 0 });
});

const src = (id: string, source: string, score: number, jev: number) => ({ id, source, score, jev: { score: jev, confidence: 1 } });

test("keep: лучшие материалы источника остаются, даже если не прошли по общему лимиту", () => {
  const xs = [src("a", "HN", 300, 2), src("b", "HN", 250, 2), src("c", "HN", 200, 2), src("g1", "GH", 90, 1.5), src("g2", "GH", 80, 1.2), src("g3", "GH", 70, 1.1)];
  const r = limitItems(xs, { maxItems: 4, keep: { GH: 2 } });
  expect(r.items.map((i) => i.id)).toEqual(["a", "b", "g1", "g2"]); // порядок по весу сохранён
  expect(r.dropped).toBe(2);
});

test("keep не обходит порог minJev", () => {
  const xs = [src("a", "HN", 300, 2), src("g1", "GH", 90, 1.5), src("g2", "GH", 80, 0.05)];
  expect(limitItems(xs, { minJev: 1, maxItems: 1, keep: { GH: 2 } }).items.map((i) => i.id)).toEqual(["g1"]);
});

test("keep: если источник и так прошёл по весу, лишних мест не занимает", () => {
  const xs = [src("g1", "GH", 300, 3), src("a", "HN", 200, 2), src("b", "HN", 100, 2)];
  expect(limitItems(xs, { maxItems: 2, keep: { GH: 1 } }).items.map((i) => i.id)).toEqual(["g1", "a"]);
});
