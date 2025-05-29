# TeleRPG-G2

A Telegram-based MMORPG built with Bun, TypeScript, PostgreSQL, Redis, and grammY.js.

## Overview

TeleRPG-G2 is a multiplayer RPG that runs entirely through Telegram. Players can create characters, explore areas, engage in combat, craft items, and interact in a persistent game world.

## Phase 1 Implementation Status ✅

**Core Infrastructure Setup:**
- ✅ Bun project with TypeScript support
- ✅ Docker configuration with PostgreSQL v17 and Redis v8
- ✅ Database setup with Kysely query builder
- ✅ Redis connection with BullMQ for job queuing
- ✅ Telegram bot setup with grammY.js (no sessions per project requirements)
- ✅ ESLint and TypeScript configuration
- ✅ Testing framework with Bun's built-in test runner
- ✅ Database migration system

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed on your machine
- [Docker](https://www.docker.com/) and Docker Compose
- A Telegram Bot Token (from [@BotFather](https://t.me/botfather))

### Installation

```bash
# Clone the repository
git clone https://github.com/KnightNiwrem/TeleRPG-G2.git
cd TeleRPG-G2

# Install dependencies
bun install
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your Telegram bot token
# BOT_TOKEN=your_telegram_bot_token_here
```

### Development

#### Starting the Services

```bash
# Start PostgreSQL and Redis with Docker
bun run docker:up

# Run database migrations
bun run migrate:up

# Start the application
bun run dev
```

#### Running Tests

```bash
# Run all tests
bun test

# Run linting
bun run lint

# Run type checking
bun run typecheck
```

### Docker Development

```bash
# Build and start all services including the app
docker compose up -d

# View logs
docker compose logs -f app

# Stop all services
docker compose down
```

## Project Structure

```
src/
├── bot/          # Telegram bot setup and command handlers
├── database/     # Database connection, types, and migrations
├── redis/        # Redis connection and BullMQ queue setup
└── services/     # Game logic services (to be implemented in Phase 2)
scripts/          # Utility scripts (migrations, etc.)
```

## Database Schema

### Core Tables (Phase 1)
- **players**: Player character data, stats, and status
- **game_areas**: World areas and locations
- **player_inventory**: Player item storage

### Migration Commands

```bash
# Run migrations up (create tables)
bun run migrate:up

# Roll back migrations
bun run migrate:down
```

## Available Scripts

- `bun start` - Start the application
- `bun run dev` - Start with watch mode
- `bun test` - Run tests
- `bun run lint` - Run ESLint
- `bun run typecheck` - Run TypeScript type checking
- `bun run migrate:up` - Run database migrations
- `bun run migrate:down` - Roll back migrations
- `bun run docker:up` - Start Docker services
- `bun run docker:down` - Stop Docker services

## Current Bot Commands

- `/start` - Welcome message and introduction
- `/help` - List of available commands
- `/createcharacter` - Create character (coming in Phase 2)
- `/profile` - View character profile (coming in Phase 2)
- `/area` - Look around current area (coming in Phase 2)

## Next Phase Implementation

Phase 2 will implement:
- Player management system
- Job class system
- World and area system
- Travel mechanics with BullMQ
- Basic inventory system

## Development Notes

See `copilot-notes.md` for detailed development decisions, architecture notes, and lessons learned.

## License

MIT License - see LICENSE file for details.