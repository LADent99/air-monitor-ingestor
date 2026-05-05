import mqtt from "mqtt";

/** Initialize the MQTT Client */
export async function connectMqtt(subscription: string): Promise<mqtt.MqttClient> {
  // This function initializes an MQTT client and returns it
  const mqttBrokerUrl = process.env.MQTT_BROKER_URL;
  if (!mqttBrokerUrl) {
    throw new Error("MQTT_BROKER_URL is not set!");
  }

  const mqttBrokerPassword = process.env.MQTT_PASSWORD;
  if (!mqttBrokerPassword) {
    throw new Error("MQTT_PASSWORD is not set!");
  }

  const mqttBrokerUsername = process.env.MQTT_USERNAME;
  if (!mqttBrokerUsername) {
    throw new Error("MQTT_USERNAME is not set!");
  }

  const client = mqtt.connect(mqttBrokerUrl, {
    username: mqttBrokerUsername,
    password: mqttBrokerPassword,
  });
  client.on("error", (err) => {
    console.error("MQTT error: ", err);
  });

  await new Promise<void>((resolve, reject) => {
    client.once("connect", () => resolve());
    client.once("error", reject);
  });

  await client.subscribeAsync(subscription);
  console.log("Client created + subscribed successfully to: ", subscription);
  return client;
}
