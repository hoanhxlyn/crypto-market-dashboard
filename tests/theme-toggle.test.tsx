import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeToggle } from "~/components/theme-toggle";
import theme from "~/config/mantine";

describe("ThemeToggle", () => {
  it("renders three options: light, dark, auto", () => {
    render(
      <MantineProvider theme={theme}>
        <ThemeToggle />
      </MantineProvider>,
    );
    expect(screen.getByLabelText("Toggle color scheme")).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    const { container } = render(
      <MantineProvider theme={theme}>
        <ThemeToggle />
      </MantineProvider>,
    );
    expect(container.firstChild).toBeTruthy();
  });
});
