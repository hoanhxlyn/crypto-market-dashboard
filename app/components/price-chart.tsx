import { AreaChart, getFilteredChartTooltipPayload } from "@mantine/charts";
import { Group, Paper, Skeleton, Stack, Text } from "@mantine/core";
import { useMemo } from "react";
import { useParams } from "react-router";
import { useCoinDetail } from "~/hooks/queries";
import { useFilterParams } from "~/hooks/use-filter-params";
import {
  formatAxisPrice,
  formatDay,
  formatDayTime,
  formatPrice,
} from "~/lib/format";

const HEIGHT = 240;

export function PriceChart() {
  const { id } = useParams();
  const { vsCurrency } = useFilterParams();

  const { data, status } = useCoinDetail(id ?? "", vsCurrency);

  const points = useMemo(
    () => (data?.prices ?? []).map(([time, price]) => ({ time, price })),
    [data?.prices],
  );

  if (status === "pending") {
    return <Skeleton height={HEIGHT} radius="md" />;
  }

  if (status === "error" || points.length < 2) {
    return (
      <Text size="sm" c="dimmed">
        {status === "error"
          ? "Failed to load chart."
          : "Not enough data to chart."}
      </Text>
    );
  }

  const first = points[0];
  const last = points[points.length - 1];
  const rising = last.price >= first.price;
  const prices = points.map((p) => p.price);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const pad = (high - low) * 0.03 || 1;

  return (
    <>
      <Paper withBorder p="md" radius="md">
        <AreaChart
          h={HEIGHT}
          data={points}
          dataKey="time"
          series={[{ name: "price", color: rising ? "green.6" : "red.6" }]}
          withGradient
          curveType="monotone"
          withDots={false}
          tooltipAnimationDuration={300}
          strokeWidth={2.5}
          tickLine="none"
          gridAxis="y"
          gridProps={{
            strokeDasharray: "3 3",
            stroke: "var(--mantine-color-gray-4)",
          }}
          xAxisProps={{
            tickFormatter: formatDay,
            type: "number",
            domain: ["dataMin", "dataMax"],
            minTickGap: 48,
          }}
          yAxisProps={{
            orientation: "right",
            tickFormatter: formatAxisPrice,
            width: 64,
            domain: [low - pad, high + pad],
          }}
          tooltipProps={{
            content: ({ payload }) => {
              const filtered = getFilteredChartTooltipPayload(payload);
              const point = filtered?.[0]?.payload;
              if (!point) return null;
              return (
                <Paper withBorder p="xs" radius="sm">
                  <Stack gap={2}>
                    <Text size="xs" c="dimmed">
                      {formatDayTime(point.time)}
                    </Text>
                    <Text size="sm" fw={500}>
                      {formatPrice(point.price, vsCurrency)}
                    </Text>
                  </Stack>
                </Paper>
              );
            },
          }}
        />
      </Paper>
      <Paper withBorder p="sm" radius="md" mt="sm">
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            Low {formatPrice(low, vsCurrency)}
          </Text>
          <Text size="xs" c="dimmed">
            7 day range
          </Text>
          <Text size="xs" c="dimmed">
            High {formatPrice(high, vsCurrency)}
          </Text>
        </Group>
      </Paper>
    </>
  );
}
