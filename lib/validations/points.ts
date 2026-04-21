import { z } from "zod";

export const givePointsSchema = z.object({
  user_id: z.string().uuid(),
  amount: z.number().int().min(1, "Minimal pemberian 1 poin"),
  reason: z.string().min(3, "Alasan pemberian poin harus jelas"),
});

export const redeemRewardSchema = z.object({
  product_id: z.number().int().positive("ID Produk tidak valid"),
});

export type GivePointsInput = z.infer<typeof givePointsSchema>;
export type RedeemRewardInput = z.infer<typeof redeemRewardSchema>;
