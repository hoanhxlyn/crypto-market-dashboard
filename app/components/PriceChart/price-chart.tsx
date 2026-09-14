import { Skeleton, Text } from "@mantine/core";
import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AXIS_LINE_STYLE, AXIS_TICK_STYLE } from "~/constants";
import {
  formatAxisPrice,
  formatDay,
  formatDayTime,
  formatPrice,
} from "~/lib/format";
import type { CoinDetail } from "~/types/coin";
import styles from "./price-chart.module.css";

const HEIGHT = 240;

interface PricePoint {
  time: number;
  price: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: { payload: PricePoint }[];
  currency: string;
}

function ChartTooltip({ active, payload, currency }: ChartTooltipProps) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipTime}>{formatDayTime(point.time)}</p>
      <p className={styles.tooltipPrice}>
        {formatPrice(point.price, currency)}
      </p>
    </div>
  );
}

interface PriceChartProps {
  data: CoinDetail;
  currency?: string;
  loading?: boolean;
}

export function PriceChart({
  data,
  currency = "usd",
  loading,
}: PriceChartProps) {
  const gradientId = useId();

  const points = useMemo<PricePoint[]>(
    () => data.prices.map(([time, price]) => ({ time, price })),
    [data.prices],
  );

  if (loading) {
    return <Skeleton height={HEIGHT} radius="md" />;
  }

  if (points.length < 2) {
    return (
      <Text size="sm" c="dimmed">
        Not enough data to chart.
      </Text>
    );
  }

  const prices = points.map((p) => p.price);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const first = points[0];
  const last = points[points.length - 1];
  const rising = last.price >= first.price;

  return (
    <figure className={styles.wrapper}>
      <div
        className={rising ? styles.chartArea : styles.chartAreaDown}
        role="img"
        aria-label={`${data.prices.length} data points, price from ${formatPrice(first.price, currency)} to ${formatPrice(last.price, currency)}`}
      >
        <ResponsiveContainer width="100%" height={HEIGHT}>
          <AreaChart
            data={points}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.25} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatDay}
              tick={AXIS_TICK_STYLE}
              axisLine={AXIS_LINE_STYLE}
              tickLine={false}
              minTickGap={48}
            />
            <YAxis
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatAxisPrice}
              tick={AXIS_TICK_STYLE}
              axisLine={false}
              tickLine={false}
              orientation="right"
              width={64}
            />
            <Tooltip content={<ChartTooltip currency={currency} />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="currentColor"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 3, fill: "currentColor", strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <figcaption className={styles.caption}>
        <span>Low {formatPrice(low, currency)}</span>
        <span>{data.prices.length} data points</span>
        <span>High {formatPrice(high, currency)}</span>
      </figcaption>
    </figure>
  );
}
