import { describe, expect, it } from "vitest";
import {
  formatAxisPrice,
  formatDay,
  formatDayTime,
  formatPrice,
} from "~/lib/format";

describe("formatPrice", () => {
  it("formats large values with 2 decimals", () => {
    expect(formatPrice(65432.1, "usd")).toBe("$65,432.10");
  });

  it("formats small values (< 1) with 6 decimals", () => {
    expect(formatPrice(0.123456, "usd")).toBe("$0.123456");
  });

  it("respects currency code", () => {
    const result = formatPrice(1000, "eur");
    expect(result).toContain("1,000");
    expect(result).toMatch(/€/);
  });

  it("handles zero", () => {
    expect(formatPrice(0, "usd")).toBe("$0.000000");
  });
});

describe("formatAxisPrice", () => {
  it("formats billions", () => {
    expect(formatAxisPrice(2_500_000_000)).toBe("$2.5B");
  });

  it("formats millions", () => {
    expect(formatAxisPrice(3_400_000)).toBe("$3.4M");
  });

  it("formats thousands", () => {
    expect(formatAxisPrice(15_600)).toBe("$15.6K");
  });

  it("formats small values with 2 decimals", () => {
    expect(formatAxisPrice(99.5)).toBe("$99.50");
  });

  it("formats values exactly at boundaries", () => {
    expect(formatAxisPrice(1_000_000_000)).toBe("$1.0B");
    expect(formatAxisPrice(1_000_000)).toBe("$1.0M");
    expect(formatAxisPrice(1_000)).toBe("$1.0K");
  });
});

describe("formatDay", () => {
  it("returns month and day", () => {
    const result = formatDay(new Date("2025-01-15").getTime());
    expect(result).toContain("Jan");
    expect(result).toContain("15");
  });
});

describe("formatDayTime", () => {
  it("returns month, day, and time", () => {
    const result = formatDayTime(new Date("2025-06-20T14:30:00").getTime());
    expect(result).toContain("Jun");
    expect(result).toContain("20");
  });
});
