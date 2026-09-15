import type { Coin, CoinDetail } from "../types/coin";
import { coinArraySchema, coinDetailSchema } from "../types/coin";

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function fetchCoins(
  params: {
    vsCurrency: string;
    order: string;
    perPage: number;
    page: number;
  },
  signal?: AbortSignal,
): Promise<Coin[]> {
  const searchParams = new URLSearchParams({
    vs_currency: params.vsCurrency,
    order: params.order,
    per_page: String(params.perPage),
    page: String(params.page),
    sparkline: "false",
  });

  const res = await fetch(`${BASE_URL}/coins/markets?${searchParams}`, {
    signal,
  });
  if (res.status === 429) {
    throw new Error("Rate limited by CoinGecko");
  }
  if (!res.ok) {
    throw new Error(`CoinGecko returned ${res.status}`);
  }

  const json = await res.json();
  const parsed = coinArraySchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Unexpected API response shape");
  }

  return parsed.data;
}

async function checkRateLimit(res: Response) {
  if (res.status === 429) {
    throw new Error("Rate limited by CoinGecko");
  }
  if (!res.ok) {
    throw new Error(`CoinGecko returned ${res.status}`);
  }
}

export async function fetchCoinDetail(
  params: {
    id: string;
    vsCurrency: string;
  },
  signal?: AbortSignal,
): Promise<CoinDetail> {
  const detailParams = new URLSearchParams({
    vs_currency: params.vsCurrency,
    localization: "false",
    tickers: "false",
    community_data: "false",
    developer_data: "false",
  });
  const chartParams = new URLSearchParams({
    vs_currency: params.vsCurrency,
    days: "7",
  });

  const [detailRes, chartRes] = await Promise.all([
    fetch(`${BASE_URL}/coins/${params.id}?${detailParams}`, { signal }),
    fetch(`${BASE_URL}/coins/${params.id}/market_chart?${chartParams}`, {
      signal,
    }),
  ]);

  await Promise.all([checkRateLimit(detailRes), checkRateLimit(chartRes)]);

  const [detailJson, chartJson] = await Promise.all([
    detailRes.json(),
    chartRes.json(),
  ]);

  const parsed = coinDetailSchema.safeParse({
    ...detailJson,
    prices: chartJson.prices,
  });
  if (!parsed.success) {
    throw new Error("Unexpected API response shape");
  }

  return parsed.data;
}
