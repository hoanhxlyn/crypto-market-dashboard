import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  NumberFormatter,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useParams, useSearchParams } from "react-router";
import { PriceChart } from "~/components/PriceChart/price-chart";
import { CURRENCIES, PERIODS } from "~/constants";
import { useCoinDetail } from "~/hooks/queries";

export function meta({ params }: { params: { id: string } }) {
  return [{ title: `Coin Detail — ${params.id}` }];
}

export default function CoinDetailPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const days = Number(searchParams.get("days") ?? 7);
  const vsCurrency = searchParams.get("vs_currency") ?? "usd";

  const {
    data: coin,
    status,
    refetch,
    isFetching,
  } = useCoinDetail(id ?? "", vsCurrency, days);

  function setParam(key: string, value: string) {
    setSearchParams((prev) => {
      prev.set(key, value);
      return prev;
    });
  }

  if (status === "pending") {
    return (
      <Stack gap="lg" maw={800} mx="auto" px="lg" py="xl">
        <Skeleton height={40} width={200} />
        <Skeleton height={200} />
        <Skeleton height={300} />
      </Stack>
    );
  }

  if (status === "error") {
    return (
      <Stack gap="lg" maw={800} mx="auto" px="lg" py="xl">
        <Alert color="red" title="Failed to load coin">
          Could not fetch data for "{id}". The coin may not exist or the API
          returned an error.
        </Alert>
        <Group>
          <Button loading={isFetching} onClick={() => refetch()}>
            Retry
          </Button>
          <Button component={Link} to="/" variant="default">
            Back to list
          </Button>
        </Group>
      </Stack>
    );
  }

  const change = coin.market_data.price_change_percentage_24h;
  const positive = (change ?? 0) >= 0;

  return (
    <Stack gap="lg" maw={800} mx="auto" px="lg" py="xl">
      <Button
        component={Link}
        to="/"
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
      >
        Back to list
      </Button>

      <Group gap="md" align="center">
        <Avatar src={coin.image.large} alt={coin.name} size="xl" radius="md" />
        <div>
          <Title order={1}>{coin.name}</Title>
          <Text size="lg" c="dimmed" tt="uppercase">
            {coin.symbol}
          </Text>
        </div>
        <Badge color={positive ? "green" : "red"} variant="light" size="lg">
          {positive ? "+" : ""}
          {change?.toFixed(2) ?? "0.00"}%
        </Badge>
      </Group>

      <Card withBorder padding="lg" radius="md">
        <SimpleGrid cols={2}>
          <div>
            <Text size="sm" c="dimmed">
              Current Price
            </Text>
            <NumberFormatter
              value={coin.market_data.current_price[vsCurrency] ?? 0}
              prefix="$"
              thousandSeparator
              style={{
                fontWeight: 700,
                fontSize: "var(--mantine-font-size-xl)",
              }}
            />
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Market Cap Rank
            </Text>
            <Text fw={700} size="xl">
              #{coin.market_cap_rank ?? "—"}
            </Text>
          </div>
        </SimpleGrid>
      </Card>

      <Group gap="xs">
        <Select
          size="compact-sm"
          data={CURRENCIES}
          value={vsCurrency}
          onChange={(v) => v && setParam("vs_currency", v)}
          w={80}
        />
        {PERIODS.map((p) => (
          <Button
            key={p.days}
            size="compact-sm"
            variant={days === p.days ? "filled" : "default"}
            onClick={() => setParam("days", String(p.days))}
          >
            {p.label}
          </Button>
        ))}
      </Group>

      <PriceChart data={coin} currency={vsCurrency} loading={isFetching} />
    </Stack>
  );
}
