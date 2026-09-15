export const CURRENCIES = [
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
  { value: "gbp", label: "GBP" },
  { value: "jpy", label: "JPY" },
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
