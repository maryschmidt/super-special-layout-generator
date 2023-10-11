import { describe, test, expect } from "vitest";
import { getTransformerCount } from "./getTransformerCount";

describe(getTransformerCount.name, () => {
  test("returns 0 for undefined input", () => {
    expect(getTransformerCount()).toBe(0);
  });

  test("returns required transformer count for 0 batteries", () => {
    expect(getTransformerCount(0)).toBe(0);
  });

  test("returns required transformer count for an even number of batteries", () => {
    expect(getTransformerCount(2)).toBe(1);
  });

  test("returns required transformer count for an odd number of batteries", () => {
    expect(getTransformerCount(5)).toBe(3);
  });
});
