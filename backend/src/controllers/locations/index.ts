import express from 'express';
import { searchLocations } from '../../db/locations.js';
import { z } from 'zod';

export const locations = [
  'ATL',
  'PEK',
  'LAX',
  'DXB',
  'HND',
  'ORD',
  'LHR',
  'PVG',
  'CDG',
  'DFW',
  'AMS',
  'FRA',
  'IST',
  'CAN',
  'JFK',
  'SIN',
  'DEN',
  'ICN',
  'BKK',
  'SFO',
  'LAS',
  'CLT',
  'MIA',
  'KUL',
  'SEA',
  'MUC',
  'EWR',
  'MAD',
  'HKG',
  'MCO',
  'PHX',
  'IAH',
  'SYD',
  'MEL',
  'GRU',
  'YYZ',
  'LGW',
  'BCN',
  'MAN',
  'BOM',
  'DEL',
  'ZRH',
  'SVO',
  'DME',
  'JNB',
  'ARN',
  'OSL',
  'CPH',
  'HEL',
  'VIE',
] as const;

export const locationsRouter = express.Router();

locationsRouter.get('/', async (req, res) => {
  const { success, data } = await z.string().safeParseAsync(req.query.q);
  const locations = await searchLocations(success ? data : '');
  res.send(locations);
});
