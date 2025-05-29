# Copilot Development Notes

## Project Overview
This is a Telegram MMORPG implementation using Bun, TypeScript, PostgreSQL, Redis, and grammY.js.

## Architecture Decisions

### Database (PostgreSQL + Kysely)
- **Choice**: PostgreSQL v17 with Kysely query builder
- **Reasoning**: Kysely provides excellent TypeScript support and type safety
- **Schema**: Created initial tables for players, player_inventory, and game_areas
- **Migration**: Simple up/down migration system implemented

### Message Queue (Redis + BullMQ)
- **Choice**: Redis v8 with BullMQ for job processing
- **Reasoning**: BullMQ provides robust job queuing with Redis backend
- **Queues**: 
  - `general_tasks` - for crafting and other general async operations
  - `travel_tasks` - specifically for travel completion jobs

### Telegram Bot (grammY.js)
- **Choice**: grammY.js framework
- **Important**: Sessions are explicitly NOT used per project requirements
- **Context**: Custom BotContext extends base Context for future extensions
- **Commands**: Basic structure with /start and /help implemented

### Project Structure
```
src/
├── bot/          # Telegram bot setup and commands
├── database/     # Database connection, types, migrations
├── redis/        # Redis connection and BullMQ setup
└── services/     # Game logic services (to be implemented)
```

## Implementation Notes

### Phase 1 Setup ✅
- [x] Docker configuration with PostgreSQL v17 and Redis v8
- [x] Dependencies installed: kysely, pg, bullmq, ioredis, grammy
- [x] Database schema and connection setup
- [x] Redis connection and BullMQ queue setup
- [x] Basic Telegram bot with command structure
- [x] Environment configuration (.env.example)

### Next Steps (Phase 2)
- Player service implementation
- Job class system with static JSON data
- World & area system
- Travel system with BullMQ integration
- Inventory system

## Testing Strategy
- Using Bun's built-in test runner
- Separate test database (postgres_test service)
- Test environment variables for isolated testing

## Lessons Learned
- Kysely types provide excellent compile-time safety for SQL operations
- BullMQ job data interfaces help maintain type safety across async operations
- grammY.js command setup is straightforward and flexible

## TODOs
- [ ] Implement actual game logic services
- [ ] Add comprehensive error handling
- [ ] Set up proper logging system
- [ ] Add input validation for bot commands
- [ ] Create static data JSON files for game content