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
    current_price: z.object({ usd: z.number() }),
    price_change_percentage_24h: z.number().nullable(),
  }),
});

export type Coin = z.infer<typeof coinSchema>;
export type CoinDetail = z.infer<typeof coinDetailSchema>;
