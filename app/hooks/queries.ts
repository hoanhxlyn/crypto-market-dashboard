import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { fetchCoinDetail, fetchCoins } from "~/lib/api";

export const queryKey = {
  all: ["coins"],
  list: (query: object) => [...queryKey.all, "list", query] as const,
  detail: (id: string) => [...queryKey.all, "detail", id] as const,
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

export function useCoinDetail(id: string) {
  return useQuery({
    queryKey: queryKey.detail(id),
    queryFn: ({ signal }) => fetchCoinDetail(id, signal),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}
