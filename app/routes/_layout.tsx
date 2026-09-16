import { AppShell, Group, Title } from "@mantine/core";
import { Outlet } from "react-router";
import { ThemeToggle } from "~/components/theme-toggle";

export default function AppLayout() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={4}>Crypto Market Dashboard</Title>
          <ThemeToggle />
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
