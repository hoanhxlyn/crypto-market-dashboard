import { Avatar, Card, Group, Text } from "@mantine/core";
import { Link, useLocation } from "react-router";
import { ChangeBadge } from "~/components/change-badge";
import { useCoinParams, useFetchCoins } from "~/hooks/queries";
import { formatPrice } from "~/lib/format";

export function CoinCard({ coinId }: { coinId: string }) {
  const { data: coins } = useFetchCoins();
  const { vsCurrency } = useCoinParams();
  const location = useLocation();
  const coin = coins?.find((c) => c.id === coinId);

  return (
    <Link
      to={`/coins/${coinId}${location.search}`}
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

          <Text size="xs" c="dimmed">
            Rank #{coin?.market_cap_rank ?? "—"}
          </Text>
        </Group>

        <Group justify="space-between" mt="md">
          <Text fw={700} style={{ fontSize: "var(--mantine-font-size-lg)" }}>
            {formatPrice(coin?.current_price ?? 0, vsCurrency)}
          </Text>
          <ChangeBadge change={coin?.price_change_percentage_24h} />
        </Group>
      </Card>
    </Link>
  );
}
