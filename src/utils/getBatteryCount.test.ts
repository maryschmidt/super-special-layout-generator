import { describe, test, expect } from "vitest";
import { getBatteryCount } from "./getBatteryCount";

describe(getBatteryCount.name, () => {
  test("returns 0 when all subcounts are 0", () => {
    const devices = {
      megapackxl: 0,
      megapack2: 0,
      megapack: 0,
      powerpack: 0,
      transformer: 0,
    };
    expect(getBatteryCount(devices)).toBe(0);
  });

  test("returns the sum of the inputs", () => {
    const devices = {
      megapackxl: 1,
      megapack2: 2,
      megapack: 3,
      powerpack: 4,
      transformer: 5,
    };
    expect(getBatteryCount(devices)).toBe(10);
  });
});
