import { z } from "zod";


export const tripSchema = z.object({
  id: z.number(),
  origin: z.string(),
  destination: z.string(),
  type: z.enum(["flight", "train", "car", "other"]),
  display_name: z.string(),
  cost: z.number(),
  duration: z.number(),
  saved: z.boolean().optional(),
});

export type Trip = z.infer<typeof tripSchema>;

export type TripType = Pick<Trip, "type">["type"];