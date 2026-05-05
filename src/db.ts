import * as z from "zod";
import { Pool } from "pg";
import { ReadingSchema } from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set!");
}
const pool = new Pool({ connectionString: databaseUrl });
export async function insertReading(reading: z.infer<typeof ReadingSchema>): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO readings (time, location, temperature, humidity, pm1_0, pm2_5, pm4_0, pm10_0, co2, voc_index, nox_index) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9, $10, $11)`,
      [
        reading.time,
        reading.location,
        reading.temperature,
        reading.humidity,
        reading.pm1_0,
        reading.pm2_5,
        reading.pm4_0,
        reading.pm10_0,
        reading.co2,
        reading.voc_index,
        reading.nox_index,
      ],
    );
    console.info("Inserted reading: ", reading);
  } catch (err) {
    console.error("Failed to insert reading: ", err);
  }
}
