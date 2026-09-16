import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import theme from "~/config/mantine";

vi.mock("~/lib/api", () => ({
  fetchCoins: vi.fn(),
  fetchCoinDetail: vi.fn(),
}));

import { fetchCoins } from "~/lib/api";
import type { Coin } from "~/types/coin";

const mockFetchCoins = vi.mocked(fetchCoins);

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
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://example.com/sol.png",
    current_price: 150,
    market_cap_rank: 3,
    price_change_percentage_24h: 5.0,
  },
];

// Import the route module fresh (not mocked)
const { default: HomePage, meta } = await import("~/routes/_layout._index");

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

describe("HomePage integration", () => {
  it("returns meta tags", () => {
    const metaResult = meta();
    expect(metaResult).toEqual([
      { title: "Crypto Market Dashboard" },
      {
        name: "description",
        content: "Live top cryptocurrencies by market cap",
      },
    ]);
  });

  it("renders skeleton while loading", async () => {
    mockFetchCoins.mockReturnValue(new Promise(() => {})); // never resolves
    renderHome();
    const skeleton = document.querySelector(".skeleton");
    expect(skeleton).toBeTruthy();
  });

  it("shows error with retry button on failure", async () => {
    mockFetchCoins.mockRejectedValue(new Error("fail"));
    renderHome();
    await screen.findByText("Failed to load data");
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("renders coin cards on success", async () => {
    mockFetchCoins.mockResolvedValue(mockCoins);
    renderHome();
    await screen.findByText("Bitcoin");
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByText("Solana")).toBeInTheDocument();
  });

  it("renders search, sort, and currency controls", async () => {
    mockFetchCoins.mockResolvedValue(mockCoins);
    renderHome();
    await screen.findByText("Bitcoin");
    expect(
      screen.getByPlaceholderText("Search by name or symbol"),
    ).toBeInTheDocument();
    expect(screen.getByText("Currency")).toBeInTheDocument();
    expect(screen.getByText("Sort by")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle sort direction")).toBeInTheDocument();
    expect(screen.getByText("20 coins per page")).toBeInTheDocument();
  });

  it("shows empty state when search has no matches", async () => {
    mockFetchCoins.mockResolvedValue(mockCoins);
    renderHome(["/?q=zzzznonexistent"]);
    await screen.findByText("No results");
    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(screen.queryByText("Bitcoin")).not.toBeInTheDocument();
  });

  it("filters coins by search query", async () => {
    mockFetchCoins.mockResolvedValue(mockCoins);
    renderHome(["/?q=bit"]);
    await screen.findByText("Bitcoin");
    expect(screen.queryByText("Ethereum")).not.toBeInTheDocument();
    expect(screen.queryByText("Solana")).not.toBeInTheDocument();
  });

  it("sorts coins by price descending", async () => {
    mockFetchCoins.mockResolvedValue(mockCoins);
    renderHome(["/?sort=current_price&dir=desc"]);
    await screen.findByText("Bitcoin");
    const cards = screen.getAllByRole("link");
    expect(cards[0]).toHaveTextContent("Bitcoin");
    expect(cards[1]).toHaveTextContent("Ethereum");
    expect(cards[2]).toHaveTextContent("Solana");
  });

  it("sorts coins by price ascending", async () => {
    mockFetchCoins.mockResolvedValue(mockCoins);
    renderHome(["/?sort=current_price&dir=asc"]);
    await screen.findByText("Bitcoin");
    const cards = screen.getAllByRole("link");
    expect(cards[0]).toHaveTextContent("Solana");
    expect(cards[1]).toHaveTextContent("Ethereum");
    expect(cards[2]).toHaveTextContent("Bitcoin");
  });
});
