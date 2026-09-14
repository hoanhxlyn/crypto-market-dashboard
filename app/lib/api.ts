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

export async function fetchCoinDetail(
  id: string,
  signal?: AbortSignal,
): Promise<CoinDetail> {
  const res = await fetch(
    `${BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
    { signal },
  );
  if (res.status === 429) {
    throw new Error("Rate limited by CoinGecko");
  }
  if (!res.ok) {
    throw new Error(`CoinGecko returned ${res.status}`);
  }

  const json = await res.json();
  const parsed = coinDetailSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error("Unexpected API response shape");
  }

  return parsed.data;
}
