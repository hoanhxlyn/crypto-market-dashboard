import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook, screen, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";

vi.mock("~/lib/api", () => ({
  fetchCoins: vi.fn(),
  fetchCoinDetail: vi.fn(),
}));

import { useCoinDetail, useFetchCoins } from "~/hooks/queries";
import { fetchCoinDetail, fetchCoins } from "~/lib/api";

const mockFetchCoins = vi.mocked(fetchCoins);
const mockFetchCoinDetail = vi.mocked(fetchCoinDetail);

let hookResult: unknown = null;

function HookConsumer({ hookFn }: { hookFn: () => unknown }) {
  hookResult = hookFn();
  return null;
}

function renderHookInRouter(hookFn: () => unknown, initialEntries = ["/"]) {
  hookResult = null;
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const router = createMemoryRouter(
    [{ path: "/", element: <HookConsumer hookFn={hookFn} /> }],
    { initialEntries },
  );

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return { getResult: () => hookResult };
}

describe("useFetchCoins", () => {
  it("fetches coins successfully", async () => {
    const mockData = [
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        image: "https://example.com/btc.png",
        current_price: 65000,
        market_cap_rank: 1,
        price_change_percentage_24h: 2.5,
      },
    ];
    mockFetchCoins.mockResolvedValue(mockData);

    const { getResult } = renderHookInRouter(() => useFetchCoins());

    await waitFor(() => {
      const r = getResult() as { status: string };
      expect(r.status).toBe("success");
    });
    expect((getResult() as { data: unknown }).data).toEqual(mockData);
  });

  it("handles error state", async () => {
    mockFetchCoins.mockRejectedValue(new Error("Network error"));

    const { getResult } = renderHookInRouter(() => useFetchCoins());

    await waitFor(() => {
      const r = getResult() as { status: string };
      expect(r.status).toBe("error");
    });
    expect((getResult() as { error: unknown }).error).toBeTruthy();
  });
});

describe("useCoinDetail", () => {
  it("fetches coin detail successfully", async () => {
    const mockDetail = {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: { thumb: "", small: "", large: "" },
      market_cap_rank: 1,
      market_data: {
        current_price: { usd: 65000 },
        price_change_percentage_24h: 2.5,
        high_24h: { usd: 66000 },
        low_24h: { usd: 64000 },
        market_cap: { usd: 1_000_000_000 },
        total_volume: { usd: 50_000_000 },
      },
      prices: [[1700000000000, 65000]] as [number, number][],
    };
    mockFetchCoinDetail.mockResolvedValue(mockDetail);

    const { getResult } = renderHookInRouter(() =>
      useCoinDetail("bitcoin", "usd"),
    );

    await waitFor(() => {
      const r = getResult() as { status: string };
      expect(r.status).toBe("success");
    });
    expect((getResult() as { data: { id: string } }).data.id).toBe("bitcoin");
  });

  it("does not fetch when id is empty", () => {
    renderHookInRouter(() => useCoinDetail("", "usd"));

    expect((hookResult as { status: string }).status).toBe("pending");
    expect(mockFetchCoinDetail).not.toHaveBeenCalled();
  });

  it("handles error state", async () => {
    mockFetchCoinDetail.mockRejectedValue(new Error("API error"));

    const { getResult } = renderHookInRouter(() =>
      useCoinDetail("bitcoin", "usd"),
    );

    await waitFor(() => {
      const r = getResult() as { status: string };
      expect(r.status).toBe("error");
    });
  });
});
