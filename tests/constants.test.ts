import { describe, expect, it } from "vitest";
import { CURRENCIES, MAX_PAGES, SORT_OPTIONS } from "~/constants";

describe("constants", () => {
  it("exports CURRENCIES with 10 items", () => {
    expect(CURRENCIES).toHaveLength(10);
    expect(CURRENCIES[0]).toEqual({ value: "usd", label: "USD" });
  });

  it("exports SORT_OPTIONS with 3 items", () => {
    expect(SORT_OPTIONS).toHaveLength(3);
    expect(SORT_OPTIONS.map((o) => o.value)).toEqual([
      "current_price",
      "price_change_percentage_24h",
      "market_cap_rank",
    ]);
  });

  it("exports MAX_PAGES as 10", () => {
    expect(MAX_PAGES).toBe(10);
  });
});
