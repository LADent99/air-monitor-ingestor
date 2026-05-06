# air-monitor-ingestor

Subscribes to `+/air-monitor/#` on the Mosquitto MQTT broker and writes each
reading into TimescaleDB. One row per message — no aggregation, no HTTP surface.

## Architecture

```
Mosquitto (MQTTS :8883)
  └── Ingestor (mqtt.js)
        └── TimescaleDB — readings table
```

The schema is owned by [air-monitor-api](../air-monitor-api). Run migrations
there before starting the ingestor.

## Setup

This project uses [direnv](https://direnv.net/) and [Nix flakes](https://nixos.wiki/wiki/Flakes).

```bash
direnv allow
npm install
cp .env.example .env   # fill in DATABASE_URL and MQTT credentials
```

## Running

```bash
npx tsx src/main.ts
```

## Environment Variables

| Variable        | Example                              | Description            |
| --------------- | ------------------------------------ | ---------------------- |
| `DATABASE_URL`  | `postgres://user:pw@localhost/airdb` | TimescaleDB connection |
| `MQTT_BROKER`   | `mqtts://mqtt.example.com:8883`      | Broker URL             |
| `MQTT_USERNAME` | `esp32`                              | Broker username        |
| `MQTT_PASSWORD` | `secret`                             | Broker password        |

## Deployment

Build and push the Docker image to ECR, then install with Helm:

```bash

export IMAGE_TAG=$(cat VERSION)
docker build -t $IMAGE_REPO:$IMAGE_TAG .
docker push $IMAGE_REPO:$IMAGE_TAG

nhelm upgrade --install air-monitor-ingestor ./helm/air-monitor-ingestor \
  --set image.repository=$IMAGE_REPO \
  --set image.tag=$IMAGE_TAG \
  --set secrets.databaseUrl=$DATABASE_URL \
  --set secrets.mqttBrokerUrl=$MQTT_BROKER_URL \
  --set secrets.mqttUsername=$MQTT_USERNAME \
  --set secrets.mqttPassword=$MQTT_PASSWORD \
  --set secrets.subscription=$SUBSCRIPTION
```

## MQTT Topics

See `documentation/mqtt-topics.md` for the full topic schema.
