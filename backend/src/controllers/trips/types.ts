import { z } from 'zod';
import { locations } from '../locations/index.js';

export const getTripsParamsSchema = z
  .object({
    origin: z.enum(locations),
    destination: z.enum(locations),
    sort_by: z.enum(['cost', 'duration']).default('duration'),
  })
  .required();

export type GetTripParams = z.infer<typeof getTripsParamsSchema>;
