import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import theme from "~/config/mantine";
import { ErrorBoundary, HydrateFallback } from "~/root";

function renderError(error: unknown) {
  return render(
    <MantineProvider theme={theme}>
      <ErrorBoundary error={error} />
    </MantineProvider>,
  );
}

describe("HydrateFallback", () => {
  it("returns null", () => {
    const result = HydrateFallback();
    expect(result).toBeNull();
  });
});

describe("ErrorBoundary", () => {
  it("renders generic error for unknown errors", () => {
    renderError(new Error("boom"));
    expect(screen.getByText("Oops!")).toBeInTheDocument();
    // In DEV mode, the error message is shown
    expect(screen.getByText("boom")).toBeInTheDocument();
  });

  it("renders 404 for not-found responses", () => {
    const error = {
      status: 404,
      statusText: "Not Found",
      data: null,
      internal: true,
    };
    renderError(error);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(
      screen.getByText("The requested page could not be found."),
    ).toBeInTheDocument();
  });

  it("renders status text for non-404 route errors", () => {
    const error = {
      status: 500,
      statusText: "Server Error",
      data: null,
      internal: true,
    };
    renderError(error);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Server Error")).toBeInTheDocument();
  });

  it("falls back to default details when statusText is empty", () => {
    const error = {
      status: 500,
      statusText: "",
      data: null,
      internal: true,
    };
    renderError(error);
    expect(
      screen.getByText("An unexpected error occurred."),
    ).toBeInTheDocument();
  });
});
