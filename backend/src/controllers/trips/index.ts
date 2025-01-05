import express from 'express';
import { searchTrips } from './search.js';
import { saveTrip, getSavedTrips, deleteTrip } from './saved.js';
import { validateRequest } from '../utils.js';
import { getTripsParamsSchema } from './types.js';
import { cookieAuth } from '../../middleware/auth.js';
import { z } from 'zod';
import { getTrip } from './get.js';

export const tripsRouter = express.Router();

tripsRouter.get(
  '/',
  validateRequest('query', getTripsParamsSchema),
  searchTrips,
);

tripsRouter.get('/saved', cookieAuth, getSavedTrips);

tripsRouter.get(
  '/:tripId',
  validateRequest('params', z.object({ tripId: z.string() })),
  getTrip,
);


tripsRouter.post(
  '/saved',
  cookieAuth,
  validateRequest('body', z.object({ id: z.string() })),
  saveTrip,
);
tripsRouter.delete(
  '/saved/:tripId',
  cookieAuth,
  validateRequest('params', z.object({ tripId: z.string() })),
  deleteTrip,
);
