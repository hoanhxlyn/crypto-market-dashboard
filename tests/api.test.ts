import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCoinDetail, fetchCoins } from "~/lib/api";

const mockCoin = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: "https://example.com/btc.png",
  current_price: 65000,
  market_cap_rank: 1,
  price_change_percentage_24h: 2.5,
};

const mockDetail = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: {
    thumb: "https://example.com/t.png",
    small: "https://example.com/s.png",
    large: "https://example.com/l.png",
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
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("fetchCoins", () => {
  it("returns parsed coins on success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([mockCoin]), { status: 200 }),
    );

    const result = await fetchCoins({
      vsCurrency: "usd",
      order: "market_cap_desc",
      perPage: 20,
      page: 1,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("bitcoin");
  });

  it("throws on 429 rate limit", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("{}", { status: 429 }),
    );

    await expect(
      fetchCoins({
        vsCurrency: "usd",
        order: "market_cap_desc",
        perPage: 20,
        page: 1,
      }),
    ).rejects.toThrow("Rate limited by CoinGecko");
  });

  it("throws on non-ok response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("{}", { status: 500 }),
    );

    await expect(
      fetchCoins({
        vsCurrency: "usd",
        order: "market_cap_desc",
        perPage: 20,
        page: 1,
      }),
    ).rejects.toThrow("CoinGecko returned 500");
  });

  it("throws on invalid response shape", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ invalid: true }), { status: 200 }),
    );

    await expect(
      fetchCoins({
        vsCurrency: "usd",
        order: "market_cap_desc",
        perPage: 20,
        page: 1,
      }),
    ).rejects.toThrow("Unexpected API response shape");
  });
});

describe("fetchCoinDetail", () => {
  it("returns parsed detail on success", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(mockDetail), { status: 200 }),
    );
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          prices: [
            [1700000000000, 65000],
            [1700086400000, 65500],
          ],
        }),
        { status: 200 },
      ),
    );

    const result = await fetchCoinDetail({
      id: "bitcoin",
      vsCurrency: "usd",
    });

    expect(result.id).toBe("bitcoin");
    expect(result.prices).toHaveLength(2);
  });

  it("throws on rate-limited detail response", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 429 }));
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ prices: [] }), { status: 200 }),
    );

    await expect(
      fetchCoinDetail({ id: "bitcoin", vsCurrency: "usd" }),
    ).rejects.toThrow("Rate limited by CoinGecko");
  });

  it("throws on rate-limited chart response", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(mockDetail), { status: 200 }),
    );
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 429 }));

    await expect(
      fetchCoinDetail({ id: "bitcoin", vsCurrency: "usd" }),
    ).rejects.toThrow("Rate limited by CoinGecko");
  });

  it("throws on invalid detail shape", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ invalid: true }), { status: 200 }),
    );
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ prices: [] }), { status: 200 }),
    );

    await expect(
      fetchCoinDetail({ id: "bitcoin", vsCurrency: "usd" }),
    ).rejects.toThrow("Unexpected API response shape");
  });
});
