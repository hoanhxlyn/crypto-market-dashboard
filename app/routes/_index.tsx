import {
  ActionIcon,
  Alert,
  Button,
  Card,
  EmptyState,
  Grid,
  Group,
  Input,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconArrowDown, IconArrowUp, IconSearch } from "@tabler/icons-react";
import { useMemo } from "react";
import { useFetchCoins } from "~/hooks/queries";
import { useFilterParams } from "~/hooks/use-filter-params";
import { CoinCard } from "../components/coin-card";
import { LoadingSkeleton } from "../components/loading-skeleton";
import type { SortKey } from "../types";

export function meta() {
  return [
    { title: "Crypto Market Dashboard" },
    {
      name: "description",
      content: "Live top-20 cryptocurrencies by market cap",
    },
  ];
}
export default function HomePage() {
  const {
    query,
    setQuery,
    debouncedQuery,
    sortKey,
    setSortKey,
    direction,
    setDirection,
  } = useFilterParams();

  const { data: coins, status, refetch, isFetching } = useFetchCoins();

  const visible = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const filtered = q
      ? (coins ?? []).filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.symbol.toLowerCase().includes(q),
        )
      : (coins ?? []);

    return [...filtered].sort((a, b) => {
      const rawA = a[sortKey];
      const rawB = b[sortKey];
      const numA = rawA == null ? -Infinity : Number(rawA);
      const numB = rawB == null ? -Infinity : Number(rawB);
      return direction === "asc" ? numA - numB : numB - numA;
    });
  }, [coins, direction, debouncedQuery, sortKey]);

  return (
    <Stack gap="lg" maw={1200} mx="auto" px="lg" py="xl">
      <Title order={1}> Crypto Market </Title>

      {status === "pending" && <LoadingSkeleton />}

      {status === "error" && (
        <>
          <Alert color="red" title="Failed to load data">
            <Text size="sm">
              Unable to reach CoinGecko. Check your connection and try again.
            </Text>
          </Alert>
          <Button loading={isFetching} onClick={() => refetch()}>
            Retry
          </Button>
        </>
      )}

      {status === "success" && (
        <>
          <Group align="flex-end" gap="sm">
            <TextInput
              placeholder="Search by name or symbol"
              leftSection={<IconSearch size={16} />}
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              rightSection={
                query ? (
                  <Input.ClearButton onClick={() => setQuery("")} />
                ) : undefined
              }
              rightSectionPointerEvents="auto"
              style={{ flex: 1, minWidth: 200 }}
            />
            <Select
              label="Sort by"
              checkIconPosition="right"
              data={[
                { value: "current_price", label: "Price" },
                { value: "price_change_percentage_24h", label: "24h change" },
                { value: "market_cap_rank", label: "Market cap rank" },
              ]}
              value={sortKey}
              onChange={(v) => setSortKey((v as SortKey) ?? "market_cap_rank")}
            />
            <ActionIcon
              variant="default"
              size="lg"
              aria-label="Toggle sort direction"
              onClick={() => setDirection(direction === "asc" ? "desc" : "asc")}
            >
              {direction === "asc" ? (
                <IconArrowUp size={18} />
              ) : (
                <IconArrowDown size={18} />
              )}
            </ActionIcon>
          </Group>

          {visible.length === 0 ? (
            <Card withBorder padding="xl" radius="md">
              <EmptyState
                icon={<IconSearch size={48} />}
                title="No results"
                description={`No coins match "${query}". Try a different name or symbol.`}
              />
            </Card>
          ) : (
            <Grid>
              {visible.map((coin) => (
                <Grid.Col
                  key={coin.id}
                  span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                >
                  <CoinCard coinId={coin.id} />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </>
      )}
    </Stack>
  );
}
