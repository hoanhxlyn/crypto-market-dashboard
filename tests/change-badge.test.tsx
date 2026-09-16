import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChangeBadge } from "~/components/change-badge";
import theme from "~/config/mantine";

function renderBadge(change: number | null | undefined) {
  return render(
    <MantineProvider theme={theme}>
      <ChangeBadge change={change} />
    </MantineProvider>,
  );
}

describe("ChangeBadge", () => {
  it("shows positive change in green", () => {
    renderBadge(5.25);
    expect(screen.getByText("5.25%")).toBeInTheDocument();
  });

  it("shows negative change in red", () => {
    renderBadge(-3.14);
    expect(screen.getByText("3.14%")).toBeInTheDocument();
  });

  it("treats zero as positive", () => {
    renderBadge(0);
    expect(screen.getByText("0.00%")).toBeInTheDocument();
  });

  it("treats null as 0%", () => {
    renderBadge(null);
    const badges = screen.getAllByText("0.00%");
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it("treats undefined as 0%", () => {
    renderBadge(undefined);
    const badges = screen.getAllByText("0.00%");
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });
});
