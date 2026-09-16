import { describe, expect, it } from "vitest";
import { coinArraySchema, coinDetailSchema, coinSchema } from "~/types/coin";

const validCoin = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: "https://example.com/btc.png",
  current_price: 65000,
  market_cap_rank: 1,
  price_change_percentage_24h: 2.5,
};

describe("coinSchema", () => {
  it("accepts a valid coin", () => {
    const result = coinSchema.safeParse(validCoin);
    expect(result.success).toBe(true);
  });

  it("accepts null market_cap_rank", () => {
    const result = coinSchema.safeParse({
      ...validCoin,
      market_cap_rank: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts null price_change_percentage_24h", () => {
    const result = coinSchema.safeParse({
      ...validCoin,
      price_change_percentage_24h: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing fields", () => {
    const result = coinSchema.safeParse({ id: "bitcoin" });
    expect(result.success).toBe(false);
  });

  it("rejects wrong types", () => {
    const result = coinSchema.safeParse({
      ...validCoin,
      current_price: "not-a-number",
    });
    expect(result.success).toBe(false);
  });
});

describe("coinArraySchema", () => {
  it("accepts an array of valid coins", () => {
    const result = coinArraySchema.safeParse([validCoin]);
    expect(result.success).toBe(true);
  });

  it("accepts an empty array", () => {
    const result = coinArraySchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it("rejects a non-array", () => {
    const result = coinArraySchema.safeParse(validCoin);
    expect(result.success).toBe(false);
  });

  it("rejects array with invalid items", () => {
    const result = coinArraySchema.safeParse([{ id: 123 }]);
    expect(result.success).toBe(false);
  });
});

const validDetail = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: {
    thumb: "https://example.com/thumb.png",
    small: "https://example.com/small.png",
    large: "https://example.com/large.png",
  },
  market_cap_rank: 1,
  market_data: {
    current_price: { usd: 65000 },
    price_change_percentage_24h: 2.5,
    high_24h: { usd: 66000 },
    low_24h: { usd: 64000 },
    market_cap: { usd: 1_000_000_000 },
    total_volume: { usd: 50_000_000 },
  },
  prices: [
    [1700000000000, 65000],
    [1700086400000, 65500],
  ],
};

describe("coinDetailSchema", () => {
  it("accepts a valid detail", () => {
    const result = coinDetailSchema.safeParse(validDetail);
    expect(result.success).toBe(true);
  });

  it("accepts null market_cap_rank", () => {
    const result = coinDetailSchema.safeParse({
      ...validDetail,
      market_cap_rank: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts null price_change_percentage_24h", () => {
    const result = coinDetailSchema.safeParse({
      ...validDetail,
      market_data: {
        ...validDetail.market_data,
        price_change_percentage_24h: null,
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing image fields", () => {
    const result = coinDetailSchema.safeParse({
      ...validDetail,
      image: { thumb: "x" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing market_data", () => {
    const { market_data: _, ...rest } = validDetail;
    const result = coinDetailSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects invalid prices format", () => {
    const result = coinDetailSchema.safeParse({
      ...validDetail,
      prices: [["not-a-number", "also-not"]],
    });
    expect(result.success).toBe(false);
  });
});
