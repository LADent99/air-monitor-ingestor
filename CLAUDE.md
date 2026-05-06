## Overview
- TypeScript MQTT ingestor — subscribes to Mosquitto and writes to TimescaleDB
- No HTTP server; runs as a long-lived process
- Uses direnv and Nix flakes for dependency management

## Project Architecture
- `src/main.ts`    — entry point
- `src/mqtt.ts`    — MQTT client and subscription setup
- `src/handler.ts` — topic parsing and validation
- `src/db.ts`      — postgres.js client, insert function
- `documentation/` — reference docs; only read when asked

## Commands
- Tail the last 20 lines of any command output to save context space
- Run dev:  `npx tsx src/main.ts`
- Lint:     `npx eslint src/`
- Format:   `npx prettier --write src/`