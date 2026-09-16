import { useQuery } from "@tanstack/react-query";
import { fetchCoinDetail, fetchCoins } from "~/lib/api";
import { useFilterParams } from "./use-filter-params";

export const queryKey = {
  all: ["coins"],
  list: (query: object) => [...queryKey.all, "list", query] as const,
  detail: (query: object) => [...queryKey.all, "detail", query] as const,
} as const;

export function useFetchCoins() {
  const { vsCurrency, order, perPage, page } = useFilterParams();

  return useQuery({
    queryKey: queryKey.list({ vsCurrency, order, perPage, page }),
    queryFn: ({ signal }) =>
      fetchCoins({ vsCurrency, order, perPage, page }, signal),
  });
}

export function useCoinDetail(id: string, vsCurrency = "usd") {
  return useQuery({
    queryKey: queryKey.detail({ id, vsCurrency }),
    queryFn: ({ signal }) => fetchCoinDetail({ id, vsCurrency }, signal),
    enabled: !!id,
  });
}
