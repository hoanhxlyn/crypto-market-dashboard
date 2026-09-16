import {
  Alert,
  Avatar,
  Button,
  Card,
  Container,
  Group,
  NumberFormatter,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useLocation, useParams } from "react-router";
import { ChangeBadge } from "~/components/change-badge";
import { PriceChart } from "~/components/price-chart";
import { useCoinDetail } from "~/hooks/queries";
import { useFilterParams } from "~/hooks/use-filter-params";

export function meta({ params }: { params: { id: string } }) {
  return [{ title: `Coin Detail — ${params.id}` }];
}

export default function CoinDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const { vsCurrency } = useFilterParams();

  const {
    data: coin,
    status,
    refetch,
    isFetching,
  } = useCoinDetail(id ?? "", vsCurrency);

  if (status === "pending") {
    return (
      <Container size={800} py="xl">
        <Stack gap="lg">
          <Skeleton height={40} width={200} />
          <Skeleton height={200} />
          <Skeleton height={300} />
        </Stack>
      </Container>
    );
  }

  if (status === "error") {
    return (
      <Container size={800} py="xl">
        <Stack gap="lg">
          <Alert color="red" title="Failed to load coin">
            Could not fetch data for "{id}". The coin may not exist or the API
            returned an error.
          </Alert>
          <Group>
            <Button loading={isFetching} onClick={() => refetch()}>
              Retry
            </Button>
            <Button
              component={Link}
              to={`/${location.search}`}
              variant="default"
            >
              Back to list
            </Button>
          </Group>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size={800} py="xl">
      <Stack gap="lg">
        <Button
          component={Link}
          to={`/${location.search}`}
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
        >
          Back to list
        </Button>

        <Group gap="md" align="center" wrap="wrap" justify="space-between">
          <Group gap="md" align="center" wrap="wrap">
            <Avatar
              src={coin.image.large}
              alt={coin.name}
              size="lg"
              radius="md"
            />
            <div style={{ flexGrow: 1 }}>
              <Title order={1}>{coin.name}</Title>
              <Text size="lg" c="dimmed" tt="uppercase">
                {coin.symbol}
              </Text>
            </div>
          </Group>
          <ChangeBadge
            change={coin.market_data.price_change_percentage_24h}
            size="lg"
          />
        </Group>

        <Card withBorder padding="lg" radius="md">
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
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
        <PriceChart />
      </Stack>
    </Container>
  );
}
