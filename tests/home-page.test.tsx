import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import theme from "~/config/mantine";
import type { Coin } from "~/types/coin";

vi.mock("~/hooks/queries", () => ({
  useFetchCoins: vi.fn(),
}));

import { useFetchCoins } from "~/hooks/queries";
import HomePage from "~/routes/_layout._index";

const mockUseFetchCoins = vi.mocked(useFetchCoins);

const mockCoins: Coin[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://example.com/btc.png",
    current_price: 65000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://example.com/eth.png",
    current_price: 3500,
    market_cap_rank: 2,
    price_change_percentage_24h: -1.2,
  },
];

function renderHome(initialEntries: string[] = ["/"]) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const router = createMemoryRouter(
    [
      { path: "/", element: <HomePage /> },
      { path: "/coins/:id", element: <div>Detail</div> },
    ],
    { initialEntries },
  );

  return render(
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>,
  );
}

describe("HomePage", () => {
  it("shows loading skeleton while pending", () => {
    mockUseFetchCoins.mockReturnValue({
      data: undefined,
      status: "pending",
      refetch: vi.fn(),
      isFetching: false,
    } as ReturnType<typeof useFetchCoins>);

    const { container } = renderHome();
    // Skeleton is rendered inside the .skeleton wrapper while pending
    const skeletonWrapper = container.querySelector(".skeleton");
    expect(skeletonWrapper).toBeTruthy();
  });

  it("shows error alert with retry button on error", () => {
    mockUseFetchCoins.mockReturnValue({
      data: undefined,
      status: "error",
      refetch: vi.fn(),
      isFetching: false,
    } as ReturnType<typeof useFetchCoins>);

    renderHome();
    expect(screen.getByText("Failed to load data")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("renders coin cards on success", () => {
    mockUseFetchCoins.mockReturnValue({
      data: mockCoins,
      status: "success",
      refetch: vi.fn(),
      isFetching: false,
    } as ReturnType<typeof useFetchCoins>);

    renderHome();
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });

  it("renders search input", () => {
    mockUseFetchCoins.mockReturnValue({
      data: mockCoins,
      status: "success",
      refetch: vi.fn(),
      isFetching: false,
    } as ReturnType<typeof useFetchCoins>);

    renderHome();
    expect(
      screen.getByPlaceholderText("Search by name or symbol"),
    ).toBeInTheDocument();
  });

  it("renders sort and currency controls", () => {
    mockUseFetchCoins.mockReturnValue({
      data: mockCoins,
      status: "success",
      refetch: vi.fn(),
      isFetching: false,
    } as ReturnType<typeof useFetchCoins>);

    renderHome();
    expect(screen.getByText("Currency")).toBeInTheDocument();
    expect(screen.getByText("Sort by")).toBeInTheDocument();
  });

  it("renders pagination", () => {
    mockUseFetchCoins.mockReturnValue({
      data: mockCoins,
      status: "success",
      refetch: vi.fn(),
      isFetching: false,
    } as ReturnType<typeof useFetchCoins>);

    renderHome();
    expect(screen.getByText("20 coins per page")).toBeInTheDocument();
  });

  it("renders sort direction toggle", () => {
    mockUseFetchCoins.mockReturnValue({
      data: mockCoins,
      status: "success",
      refetch: vi.fn(),
      isFetching: false,
    } as ReturnType<typeof useFetchCoins>);

    renderHome();
    expect(screen.getByLabelText("Toggle sort direction")).toBeInTheDocument();
  });
});
