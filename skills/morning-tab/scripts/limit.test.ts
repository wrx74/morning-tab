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
