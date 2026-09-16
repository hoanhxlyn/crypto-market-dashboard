import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFilterParams } from "~/hooks/use-filter-params";

function HookConsumer({
  onResult,
}: {
  onResult: (r: ReturnType<typeof useFilterParams>) => void;
}) {
  const result = useFilterParams();
  onResult(result);
  return (
    <div>
      <span data-testid="query">{result.query}</span>
      <span data-testid="sortKey">{result.sortKey}</span>
      <span data-testid="direction">{result.direction}</span>
      <span data-testid="vsCurrency">{result.vsCurrency}</span>
      <span data-testid="page">{String(result.page)}</span>
      <button
        data-testid="btn-setQuery"
        onClick={() => result.setQuery("eth")}
        type="button"
      >
        setQuery
      </button>
      <button
        data-testid="btn-setSortKey"
        onClick={() => result.setSortKey("current_price")}
        type="button"
      >
        setSortKey
      </button>
      <button
        data-testid="btn-setDirection"
        onClick={() => result.setDirection("desc")}
        type="button"
      >
        setDirection
      </button>
      <button
        data-testid="btn-setVsCurrency"
        onClick={() => result.setVsCurrency("eur")}
        type="button"
      >
        setVsCurrency
      </button>
      <button
        data-testid="btn-setPage"
        onClick={() => result.setPage(5)}
        type="button"
      >
        setPage
      </button>
    </div>
  );
}

function renderWithRouter(entries: string[]) {
  let result: ReturnType<typeof useFilterParams> | null = null;
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <HookConsumer
            onResult={(r) => {
              result = r;
            }}
          />
        ),
      },
    ],
    { initialEntries: entries },
  );
  render(<RouterProvider router={router} />);
  return { getResult: () => result! };
}

describe("useFilterParams", () => {
  it("returns defaults when no search params", () => {
    const { getResult } = renderWithRouter(["/"]);
    expect(getResult().query).toBe("");
    expect(getResult().sortKey).toBe("market_cap_rank");
    expect(getResult().direction).toBe("asc");
    expect(getResult().vsCurrency).toBe("usd");
    expect(getResult().order).toBe("market_cap_desc");
    expect(getResult().perPage).toBe(20);
    expect(getResult().page).toBe(1);
  });

  it("reads initial values from search params", () => {
    const { getResult } = renderWithRouter([
      "/?sort=current_price&dir=desc&vs_currency=eur&page=3",
    ]);
    expect(getResult().sortKey).toBe("current_price");
    expect(getResult().direction).toBe("desc");
    expect(getResult().vsCurrency).toBe("eur");
    expect(getResult().page).toBe(3);
  });

  it("setQuery updates the query value", async () => {
    const { getResult } = renderWithRouter(["/"]);
    await userEvent.click(screen.getByTestId("btn-setQuery"));
    expect(getResult().query).toBe("eth");
  });

  it("setSortKey updates sort key", async () => {
    const { getResult } = renderWithRouter(["/"]);
    await userEvent.click(screen.getByTestId("btn-setSortKey"));
    expect(getResult().sortKey).toBe("current_price");
  });

  it("setDirection updates direction", async () => {
    const { getResult } = renderWithRouter(["/"]);
    await userEvent.click(screen.getByTestId("btn-setDirection"));
    expect(getResult().direction).toBe("desc");
  });

  it("setVsCurrency updates currency", async () => {
    const { getResult } = renderWithRouter(["/"]);
    await userEvent.click(screen.getByTestId("btn-setVsCurrency"));
    expect(getResult().vsCurrency).toBe("eur");
  });

  it("setPage updates page number", async () => {
    const { getResult } = renderWithRouter(["/"]);
    await userEvent.click(screen.getByTestId("btn-setPage"));
    expect(getResult().page).toBe(5);
  });
});
