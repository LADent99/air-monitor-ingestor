import { connectMqtt } from "./mqtt";
import { handleMessage } from "./handler";
import { insertReading } from "./db";

// main function loop
async function main() {
  const subscription = process.env.SUBSCRIPTION;
  if (!subscription) {
    throw new Error("SUBSCRIPTION not set!");
  }
  const client = await connectMqtt(subscription);

  client.on("message", async (topic: string, payload: Buffer) => {
    const response = handleMessage(topic, payload);
    if (response.success) {
      //   console.log("Data: ", response.data);
      await insertReading(response.data);
    }
  });

  process.on("SIGINT", async () => {
    await client.endAsync();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
