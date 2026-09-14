import { z } from "zod";

export const coinSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string(),
  current_price: z.number(),
  market_cap_rank: z.number().nullable(),
  price_change_percentage_24h: z.number().nullable(),
});

export const coinArraySchema = z.array(coinSchema);

export const coinDetailSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.object({
    thumb: z.string(),
    small: z.string(),
    large: z.string(),
  }),
  market_cap_rank: z.number().nullable(),
  market_data: z.object({
    current_price: z.record(z.string(), z.number()),
    price_change_percentage_24h: z.number().nullable(),
    high_24h: z.record(z.string(), z.number().nullable()),
    low_24h: z.record(z.string(), z.number().nullable()),
    market_cap: z.record(z.string(), z.number().nullable()),
    total_volume: z.record(z.string(), z.number().nullable()),
  }),
  prices: z.array(z.tuple([z.number(), z.number()])),
});

export type Coin = z.infer<typeof coinSchema>;
export type CoinDetail = z.infer<typeof coinDetailSchema>;
