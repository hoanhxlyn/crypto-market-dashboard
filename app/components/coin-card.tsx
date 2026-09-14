import {
  Avatar,
  Badge,
  Card,
  Group,
  NumberFormatter,
  Text,
} from "@mantine/core";
import { Link } from "react-router";
import { useFetchCoins } from "~/hooks/queries";

export function CoinCard({ coinId }: { coinId: string }) {
  const { data: coins } = useFetchCoins();
  const coin = coins?.find((c) => c.id === coinId);
  const change = coin?.price_change_percentage_24h;
  const positive = (change ?? 0) >= 0;

  return (
    <Link
      to={`/coins/${coinId}`}
      style={{ textDecoration: "none", height: "100%" }}
    >
      <Card withBorder padding="lg" radius="md" h="100%">
        <Group justify="space-between" align="flex-start">
          <Group gap="sm" wrap="nowrap">
            <Avatar src={coin?.image} alt={coin?.name} size="md" radius="sm" />
            <div>
              <Text fw={600} lineClamp={1}>
                {coin?.name}
              </Text>
              <Text size="sm" c="dimmed" tt="uppercase">
                {coin?.symbol}
              </Text>
            </div>
          </Group>
          <NumberFormatter
            value={coin?.current_price ?? 0}
            prefix="$"
            thousandSeparator
            style={{
              fontWeight: 700,
              fontSize: "var(--mantine-font-size-lg)",
              textAlign: "right",
            }}
          />
        </Group>

        <Group justify="space-between" mt="md">
          <Text size="xs" c="dimmed">
            Rank #{coin?.market_cap_rank ?? "—"}
          </Text>
          <Badge color={positive ? "green" : "red"} variant="light">
            {positive ? "+" : ""}
            {change?.toFixed(2) ?? "0.00"}%
          </Badge>
        </Group>
      </Card>
    </Link>
  );
}
