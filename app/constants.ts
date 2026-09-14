export const CURRENCIES = [
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
  { value: "gbp", label: "GBP" },
  { value: "jpy", label: "JPY" },
  { value: "cny", label: "CNY" },
  { value: "aud", label: "AUD" },
  { value: "cad", label: "CAD" },
  { value: "chf", label: "CHF" },
  { value: "krw", label: "KRW" },
  { value: "btc", label: "BTC" },
  { value: "eth", label: "ETH" },
] as const;

export const SORT_OPTIONS = [
  { value: "current_price", label: "Price" },
  { value: "price_change_percentage_24h", label: "24h change" },
  { value: "market_cap_rank", label: "Market cap rank" },
] as const;

import type { SVGProps } from "react";
import type { TextProps } from "recharts";

export const AXIS_TICK_STYLE: TextProps = {
  style: { fill: "#64748b", fontSize: 11 },
};

export const AXIS_LINE_STYLE: SVGProps<SVGLineElement> = {
  style: { stroke: "#e2e8f0" },
};

export const PERIODS = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
] as const;
