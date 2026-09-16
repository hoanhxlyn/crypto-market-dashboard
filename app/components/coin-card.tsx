import { Avatar, Card, Group, Text } from "@mantine/core";
import { Link, useLocation } from "react-router";
import { ChangeBadge } from "~/components/change-badge";
import { useFilterParams } from "~/hooks/use-filter-params";
import { formatPrice } from "~/lib/format";
import type { Coin } from "~/types/coin";

export function CoinCard({ coin }: { coin: Coin }) {
  const { vsCurrency } = useFilterParams();
  const location = useLocation();

  return (
    <Link
      to={`/coins/${coin.id}${location.search}`}
      style={{ textDecoration: "none", height: "100%" }}
    >
      <Card withBorder padding="lg" radius="md" h="100%">
        <Group justify="space-between" align="flex-start">
          <Group gap="sm" wrap="nowrap">
            <Avatar src={coin.image} alt={coin.name} size="md" radius="sm" />
            <div>
              <Text fw={600} lineClamp={1}>
                {coin.name}
              </Text>
              <Text size="sm" c="dimmed" tt="uppercase">
                {coin.symbol}
              </Text>
            </div>
          </Group>

          <Text size="xs" c="dimmed">
            Rank #{coin.market_cap_rank ?? "—"}
          </Text>
        </Group>

        <Group justify="space-between" mt="md">
          <Text fw={700} style={{ fontSize: "var(--mantine-font-size-lg)" }}>
            {formatPrice(coin.current_price, vsCurrency)}
          </Text>
          <ChangeBadge change={coin.price_change_percentage_24h} />
        </Group>
      </Card>
    </Link>
  );
}
