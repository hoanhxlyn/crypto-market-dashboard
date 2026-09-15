import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { fetchCoinDetail, fetchCoins } from "~/lib/api";

export const queryKey = {
  all: ["coins"],
  list: (query: object) => [...queryKey.all, "list", query] as const,
  detail: (query: object) => [...queryKey.all, "detail", query] as const,
} as const;

export function useCoinParams() {
  const [searchParams] = useSearchParams();
  return {
    vsCurrency: searchParams.get("vs_currency") ?? "usd",
    order: searchParams.get("order") ?? "market_cap_desc",
    page: Number(searchParams.get("page") ?? 1),
    perPage: Number(searchParams.get("per_page") ?? 20),
  };
}

export function useFetchCoins() {
  const params = useCoinParams();

  return useQuery({
    queryKey: queryKey.list(params),
    queryFn: ({ signal }) => fetchCoins(params, signal),
  });
}

export function useCoinDetail(id: string, vsCurrency = "usd") {
  return useQuery({
    queryKey: queryKey.detail({ id, vsCurrency }),
    queryFn: ({ signal }) => fetchCoinDetail({ id, vsCurrency }, signal),
    enabled: !!id,
  });
}
