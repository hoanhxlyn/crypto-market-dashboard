import {
  SegmentedControl,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  useComputedColorScheme("light");

  const value = colorScheme === "auto" ? "auto" : colorScheme;

  return (
    <SegmentedControl
      value={value}
      onChange={(val) => setColorScheme(val as "light" | "dark" | "auto")}
      data={[
        { label: <IconSun size={16} />, value: "light" },
        { label: <IconMoon size={16} />, value: "dark" },
        { label: <IconDeviceDesktop size={16} />, value: "auto" },
      ]}
      aria-label="Toggle color scheme"
    />
  );
}
