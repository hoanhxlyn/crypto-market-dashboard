import { AppShell, Group, Title } from "@mantine/core";
import { Outlet } from "react-router";
import { ThemeToggle } from "~/components/theme-toggle";
import classes from "~/styles/layout.module.css";

export default function AppLayout() {
  return (
    <AppShell header={{ height: 60 }} padding="md" className={classes.shell}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={4}>Crypto Market Dashboard</Title>
          <ThemeToggle />
        </Group>
      </AppShell.Header>
      <AppShell.Main className={classes.main}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
