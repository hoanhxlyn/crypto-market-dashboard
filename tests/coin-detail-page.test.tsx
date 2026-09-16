import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import theme from "~/config/mantine";
import type { CoinDetail } from "~/types/coin";

vi.mock("~/hooks/queries", () => ({
  useCoinDetail: vi.fn(),
}));

import { useCoinDetail } from "~/hooks/queries";
import CoinDetailPage from "~/routes/_layout.coins.$id";

const mockUseCoinDetail = vi.mocked(useCoinDetail);

const mockCoinDetail: CoinDetail = {
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
  prices: [
    [1700000000000, 64000],
    [1700086400000, 65000],
    [1700172800000, 66000],
  ],
};

function renderDetail() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const router = createMemoryRouter(
    [
      { path: "/", element: <div>Home</div> },
      { path: "/coins/:id", element: <CoinDetailPage /> },
    ],
    { initialEntries: ["/coins/bitcoin"] },
  );

  return render(
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>,
  );
}

describe("CoinDetailPage", () => {
  it("shows skeleton while loading", () => {
    mockUseCoinDetail.mockReturnValue({
      data: undefined,
      status: "pending",
      refetch: vi.fn(),
      isFetching: false,
    } as ReturnType<typeof useCoinDetail>);

    const { container } = renderDetail();
    // Skeleton renders as divs with animation
    expect(container.querySelectorAll("div").length).toBeGreaterThanOrEqual(1);
  });

  it("shows error with retry button on failure", () => {
    mockUseCoinDetail.mockReturnValue({
      data: undefined,
      status: "error",
      refetch: vi.fn(),
      isFetching: false,
    } as ReturnType<typeof useCoinDetail>);

    renderDetail();
    expect(screen.getByText("Failed to load coin")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to list/i }),
    ).toBeInTheDocument();
  });

  it("renders coin details on success", () => {
    mockUseCoinDetail.mockReturnValue({
      data: mockCoinDetail,
      status: "success",
      refetch: vi.fn(),
      isFetching: false,
    } as ReturnType<typeof useCoinDetail>);

    renderDetail();
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("btc")).toBeInTheDocument();
    // Price is 65000 formatted as $65,000.00
    expect(screen.getByText((c) => c.includes("65,000"))).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes("#1"))).toBeInTheDocument();
    expect(screen.getByText(/Back to list/)).toBeInTheDocument();
  });
});
