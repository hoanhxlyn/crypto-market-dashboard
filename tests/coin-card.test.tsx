import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { CoinCard } from "~/components/coin-card";
import theme from "~/config/mantine";
import type { Coin } from "~/types/coin";

const mockCoin: Coin = {
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: "https://example.com/btc.png",
  current_price: 65432.1,
  market_cap_rank: 1,
  price_change_percentage_24h: 2.5,
};

function renderCard(coin: Coin, search = "") {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const router = createMemoryRouter(
    [
      { path: "/", element: <CoinCard coin={coin} /> },
      { path: "/coins/:id", element: <div>Detail</div> },
    ],
    { initialEntries: [`/${search}`] },
  );

  return render(
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>,
  );
}

describe("CoinCard", () => {
  it("renders coin name", () => {
    renderCard(mockCoin);
    expect(screen.getByText("Bitcoin")).toBeInTheDocument();
  });

  it("renders coin symbol", () => {
    renderCard(mockCoin);
    expect(screen.getByText("btc")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    renderCard(mockCoin);
    expect(
      screen.getByText((content) => content.includes("$65,432.10")),
    ).toBeInTheDocument();
  });

  it("renders rank", () => {
    renderCard(mockCoin);
    expect(
      screen.getByText((content) => content.includes("Rank #1")),
    ).toBeInTheDocument();
  });

  it("renders null rank as em dash", () => {
    renderCard({ ...mockCoin, market_cap_rank: null });
    expect(
      screen.getByText((content) => content.includes("Rank #—")),
    ).toBeInTheDocument();
  });

  it("renders a link to the coin detail page", () => {
    renderCard(mockCoin);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/coins/bitcoin");
  });

  it("preserves search params in link", () => {
    renderCard(mockCoin, "?vs_currency=eur");
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/coins/bitcoin?vs_currency=eur");
  });

  it("renders coin image", () => {
    renderCard(mockCoin);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/btc.png");
    expect(img).toHaveAttribute("alt", "Bitcoin");
  });
});
