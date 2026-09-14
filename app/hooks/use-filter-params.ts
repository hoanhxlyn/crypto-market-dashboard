import { useDebouncedValue } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { Direction, SortKey } from "~/types";

export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [debouncedQuery] = useDebouncedValue(query, 300);

  const sortKey = (searchParams.get("sort") ?? "market_cap_rank") as SortKey;
  const direction = (searchParams.get("dir") ?? "desc") as Direction;

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedQuery) next.set("q", debouncedQuery);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  }, [debouncedQuery, setSearchParams]);

  function setSortKey(key: SortKey) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("sort", key);
      return next;
    });
  }

  function setDirection(dir: Direction) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("dir", dir);
      return next;
    });
  }

  return {
    query,
    setQuery,
    debouncedQuery,
    sortKey,
    setSortKey,
    direction,
    setDirection,
  };
}
