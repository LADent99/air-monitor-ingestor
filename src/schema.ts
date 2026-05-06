import * as z from "zod";

export const ReadingSchema = z.object({
  time: z.coerce.date(),
  location: z.string(),
  temperature: z.float32().nullable(),
  humidity: z.float32().nullable(),
  pm1_0: z.float32().nullable(),
  pm2_5: z.float32().nullable(),
  pm4_0: z.float32().nullable(),
  pm10_0: z.float32().nullable(),
  co2: z.int32().nullable(),
  voc_index: z.int32().nullable(),
  nox_index: z.int32().nullable(),
});
