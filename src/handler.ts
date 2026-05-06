import { ReadingSchema } from "./schema";
import * as z from "zod";

type HandleMessageResponse =
  | { success: true; data: z.infer<typeof ReadingSchema> }
  | { success: false; data: null };

/** This function handles the recieved message and validates the schema */
export function handleMessage(topic: string, payload: Buffer): HandleMessageResponse {
  // Extract the room from the topic string, of format <location>/air-monitor/temperature
  const location = topic.split("/")[0];

  // Parse the payload object, recieved as a buffer and load into json
  const payloadJson = JSON.parse(payload.toString());
  payloadJson["location"] = location;

  // Validate it against the schema
  const zodResponse = ReadingSchema.safeParse(payloadJson);
  if (!zodResponse.success) {
    console.warn("Schema validation failed for payload: ", JSON.stringify(payloadJson));
    console.warn("zod Error: ", zodResponse.error);
    return { success: zodResponse.success, data: null };
  }

  return { success: zodResponse.success, data: zodResponse.data };
}
