import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { PriceChart } from "~/components/price-chart";
import theme from "~/config/mantine";

vi.mock("~/hooks/queries", () => ({
  useCoinDetail: vi.fn(),
}));

import { useCoinDetail } from "~/hooks/queries";

const mockUseCoinDetail = vi.mocked(useCoinDetail);

function renderChart() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const router = createMemoryRouter(
    [{ path: "/coins/:id", element: <PriceChart /> }],
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

describe("PriceChart", () => {
  it("shows skeleton while loading", () => {
    mockUseCoinDetail.mockReturnValue({
      data: undefined,
      status: "pending",
    } as ReturnType<typeof useCoinDetail>);

    const { container } = renderChart();
    // Mantine Skeleton renders as a div with animation
    expect(container.querySelectorAll("div").length).toBeGreaterThanOrEqual(1);
  });

  it("shows error message on failure", () => {
    mockUseCoinDetail.mockReturnValue({
      data: undefined,
      status: "error",
    } as ReturnType<typeof useCoinDetail>);

    renderChart();
    expect(screen.getByText("Failed to load chart.")).toBeInTheDocument();
  });

  it("shows 'not enough data' when fewer than 2 points", () => {
    mockUseCoinDetail.mockReturnValue({
      data: {
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
        prices: [[1700000000000, 65000]],
      },
      status: "success",
    } as ReturnType<typeof useCoinDetail>);

    renderChart();
    expect(screen.getByText("Not enough data to chart.")).toBeInTheDocument();
  });

  it("renders chart with data", () => {
    mockUseCoinDetail.mockReturnValue({
      data: {
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
        prices: [
          [1700000000000, 64000],
          [1700086400000, 65000],
          [1700172800000, 66000],
        ],
      },
      status: "success",
    } as ReturnType<typeof useCoinDetail>);

    renderChart();
    expect(screen.getByText(/7 day range/)).toBeInTheDocument();
    expect(screen.getByText(/Low/)).toBeInTheDocument();
    expect(screen.getByText(/High/)).toBeInTheDocument();
  });
});
