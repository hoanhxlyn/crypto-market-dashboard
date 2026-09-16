import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
import theme from "~/config/mantine";
import AppLayout from "~/routes/_layout";

function renderLayout() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  const router = createMemoryRouter(
    [
      {
        element: <AppLayout />,
        children: [{ path: "/", element: <div>Child content</div> }],
      },
    ],
    { initialEntries: ["/"] },
  );

  return render(
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>,
  );
}

describe("AppLayout", () => {
  it("renders the header with title", () => {
    renderLayout();
    expect(screen.getByText("Crypto Market Dashboard")).toBeInTheDocument();
  });

  it("renders the theme toggle", () => {
    renderLayout();
    expect(screen.getByLabelText("Toggle color scheme")).toBeInTheDocument();
  });

  it("renders child content via Outlet", () => {
    renderLayout();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});
