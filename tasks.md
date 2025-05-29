# MMORPG on Telegram - Implementation Plan

**Developer's Note:** Throughout this project, maintain a `copilot-notes.md` file. Use it to log ideas, approaches you've tried (especially those that didn't work), and any architectural decisions. This will save time and prevent revisiting dead ends. Remember to follow a **Test-Driven Development (TDD)** approach for all feature code: write function stubs, then tests, then implement the logic.

---

## Phase 1: Project Setup & Core Infrastructure 🏗️

### 1.1. Environment & Tooling Setup
-   [ ] **Initialize Project:**
    -   [ ] Setup Bun project (`bun init`).
    -   [ ] Initialize Git repository.
-   [ ] **Docker Configuration (`docker-compose.yml`):**
    -   [ ] Define Bun application service:
        -   [ ] Dockerfile for Bun app (using official Bun image).
        -   [ ] Volume mounts for source code.
        -   [ ] Environment variable configuration.
    -   [ ] Define PostgreSQL service:
        -   [ ] Use official Postgres image.
        -   [ ] Persistent volume for data.
        -   [ ] Environment variables for user, password, database.
    -   [ ] Define Redis service:
        -   [ ] Use official Redis image.
        -   [ ] Persistent volume for data (optional, depending on BullMQ usage).
-   [ ] **TypeScript Configuration:**
    -   [ ] Setup `tsconfig.json` (strict mode, paths, etc.).
    -   [ ] Add necessary type definitions (`@types/node`, etc.).
-   [ ] **Linting and Formatting:**
    -   [ ] Setup ESLint and Prettier.
    -   [ ] Configure scripts in `package.json` for linting and formatting.

### 1.2. Database Setup (PostgreSQL with Kysely)
-   [ ] **Kysely Integration:**
    -   [ ] Install Kysely and `pg` driver.
    -   [ ] Create database connection module.
    -   [ ] Define initial database schema (interfaces for tables).
-   [ ] **Migration System:**
    -   [ ] Choose and implement a migration tool compatible with Kysely/Node.js (e.g., Kysely's built-in migrator or a separate tool).
    -   [ ] Write initial migration script for core tables (e.g., `players`, `game_areas`).
-   [ ] **Testing Database:**
    -   [ ] Setup a separate database or schema for automated tests.
    -   [ ] Script for resetting test database before/after test runs.

### 1.3. Message Queue Setup (Redis with BullMQ)
-   [ ] **BullMQ Integration:**
    -   [ ] Install BullMQ.
    -   [ ] Create Redis connection module for BullMQ.
    -   [ ] Define basic queue(s) (e.g., `general_tasks`, `travel_tasks`).
-   [ ] **Worker Setup:**
    -   [ ] Create a basic worker process to consume jobs from BullMQ.
    -   [ ] Stub out job processor functions.
-   [ ] **Testing BullMQ:**
    -   [ ] Write tests for adding jobs to queues.
    -   [ ] Write tests for processing jobs (mocking actual game logic initially).

### 1.4. Telegram Bot Setup (grammY.js)
-   [ ] **grammY.js Integration:**
    -   [ ] Install grammY.js.
    -   [ ] Setup basic bot instance.
    -   [ ] Implement `/start` command.
    -   [ ] Configure bot token via environment variables.
-   [ ] **Session Management (if needed early on):**
    -   [ ] Evaluate grammY.js session middleware options (e.g., `sessionFree` or custom with Redis/Postgres).
    -   [ ] Implement basic session handling if required for early features.
-   [ ] **Basic Command Handling:**
    -   [ ] Create a simple command router/handler structure.
    -   [ ] Test command registration and basic responses.

### 1.5. Testing Framework Setup
-   [ ] **Choose Testing Framework:**
    -   [ ] Select a testing framework (e.g., Bun's built-in test runner, Jest, Vitest).
    -   [ ] Configure the chosen framework.
-   [ ] **Initial Tests:**
    -   [ ] Write a simple test for each major component (DB connection, Redis connection, Bot response) to ensure setup is correct.

---

## Phase 2: Core Game Systems - Data Structures & Basic Logic (TDD Approach for all features) 🧱

### 2.1. Player Management
-   [ ] **Player Schema Definition:**
    -   [ ] Define `players` table schema (e.g., `telegram_id`, `character_name`, `job_class_id`, `level`, `experience`, `hp`, `mp`, `current_area_id`, `status (idle, travelling, battling)`, `last_login`, etc.).
    -   [ ] Create Kysely types for the player table.
-   [ ] **Player Service Module (`playerService.ts`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] `createPlayer(telegramId, characterName, jobClassId)`
        -   [ ] `getPlayerByTelegramId(telegramId)`
        -   [ ] `updatePlayer(telegramId, updates)`
        -   [ ] `deletePlayer(telegramId)`
    -   [ ] **Implementation:**
        -   [ ] Implement the CRUD functions interacting with the database via Kysely.
-   [ ] **Character Creation Command (`/createcharacter`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] Handle command parsing (name, job class selection).
        -   [ ] Validate inputs.
        -   [ ] Call `playerService.createPlayer`.
        -   [ ] Send confirmation/error messages.
    -   [ ] **Implementation:**
        -   [ ] Implement the command logic using grammY.js.
-   [ ] **Player Profile Command (`/profile`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] Fetch player data using `playerService.getPlayerByTelegramId`.
        -   [ ] Format and display player information.
    -   [ ] **Implementation:**
        -   [ ] Implement the command logic.

### 2.2. Job Class System
-   [ ] **Static Data: Job Classes (`jobClasses.json`):**
    -   [ ] Define job class details (ID, name, description, base stats, unique abilities - names only for now).
        * Example: `[{ "id": 1, "name": "Guard", "description": "...", "base_stats": { "hp": 120, "attack": 10 } }, ...]`
-   [ ] **Job Class Service Module (`jobClassService.ts`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] `getJobClassById(id)`
        -   [ ] `getAllJobClasses()`
        -   [ ] `applyJobClassBaseStats(player, jobClassId)`
    -   [ ] **Implementation:**
        -   [ ] Load job class data from JSON.
        -   [ ] Implement service functions.
-   [ ] **Integration with Character Creation:**
    -   [ ] Modify `createPlayer` to use `jobClassService` for setting initial stats.
    -   [ ] Update tests for character creation to reflect job class stat application.

### 2.3. World & Area System
-   [ ] **Static Data: Areas (`areas.json`):**
    -   [ ] Define area details (ID, name, type (town, forest, mountain), description, explorable (boolean), shop_id (optional)).
        * Example: `[{ "id": 1, "name": "Starter Town", "type": "town", "explorable": false }, { "id": 2, "name": "Whispering Woods", "type": "forest", "explorable": true }]`
-   [ ] **Static Data: Travel Routes (`travelRoutes.json`):**
    -   [ ] Define connections between areas (from_area_id, to_area_id, travel_time_seconds, description).
        * Example: `[{ "from_area_id": 1, "to_area_id": 2, "travel_time_seconds": 300, "description": "A well-trodden path..." }]`
-   [ ] **Area Service Module (`areaService.ts`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] `getAreaById(id)`
        -   [ ] `getAllAreas()`
        -   [ ] `getConnectedAreas(currentAreaId)` (uses `travelRoutes.json`)
        -   [ ] `getTravelTime(fromAreaId, toAreaId)`
    -   [ ] **Implementation:**
        -   [ ] Load area and travel route data from JSONs.
        -   [ ] Implement service functions.
-   [ ] **Look Around Command (`/look` or `/area`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] Get player's current area.
        -   [ ] Display area description and available exits (from `areaService.getConnectedAreas`).
    -   [ ] **Implementation:**
        -   [ ] Implement the command logic.

### 2.4. Travel System
-   [ ] **Player State Update:**
    -   [ ] Add `destination_area_id` and `travel_finish_time` to player schema/state.
    -   [ ] Update `player.status` to "travelling".
-   [ ] **Travel Command (`/travel <destination_area_name_or_id>`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] Parse destination.
        -   [ ] Validate if player can travel (not already travelling, valid route exists).
        -   [ ] Calculate travel time using `areaService.getTravelTime`.
        -   [ ] Update player state (status, destination, finish time).
        -   [ ] Add a job to BullMQ for `travel_completion` with `playerId` and `destinationAreaId`.
        -   [ ] Send travel started message.
    -   [ ] **Implementation:**
        -   [ ] Implement the command logic.
-   [ ] **Travel Completion Worker (`travelWorker.ts`):**
    -   [ ] **Function Stubs & Tests (for job processor):**
        -   [ ] `processTravelCompletion(job)`:
            -   [ ] Get player.
            -   [ ] Verify player is still travelling to the expected destination.
            -   [ ] Update player's `current_area_id` to `destination_area_id`.
            -   [ ] Update player's status to "idle".
            -   [ ] Clear `destination_area_id` and `travel_finish_time`.
            -   [ ] Send travel arrival message to the player via Telegram bot.
    -   [ ] **Implementation:**
        -   [ ] Implement the BullMQ job processor.
-   [ ] **Action Restriction during Travel:**
    -   [ ] Create a middleware or check in command handlers to prevent actions (e.g., `/explore`, `/battle`) if player status is "travelling".
    -   [ ] Test these restrictions.

### 2.5. Inventory System
-   [ ] **Static Data: Items (`items.json`):**
    -   [ ] Define item details (ID, name, description, type (weapon, armor, consumable, material), effects (if any), stackable (boolean)).
        * Example: `[{ "id": 1, "name": "Health Potion", "type": "consumable", "effect": { "heal": 50 }, "stackable": true }]`
-   [ ] **Player Inventory Schema:**
    -   [ ] Define `player_inventory` table (e.g., `player_id`, `item_id`, `quantity`).
    -   [ ] Create Kysely types.
-   [ ] **Inventory Service Module (`inventoryService.ts`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] `addItemToInventory(playerId, itemId, quantity)`
        -   [ ] `removeItemFromInventory(playerId, itemId, quantity)`
        -   [ ] `getPlayerInventory(playerId)`
        -   [ ] `hasItem(playerId, itemId, quantity)`
        -   [ ] `getItemDetails(itemId)` (loads from `items.json`)
    -   [ ] **Implementation:**
        -   [ ] Implement functions interacting with `player_inventory` table and `items.json`.
-   [ ] **Inventory Command (`/inventory` or `/bag`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] Fetch player inventory using `inventoryService.getPlayerInventory`.
        -   [ ] Format and display inventory.
    -   [ ] **Implementation:**
        -   [ ] Implement the command logic.

### 2.6. Basic Game Loop & State Management
-   [ ] **Centralized State Access (if needed beyond player object):**
    -   [ ] Evaluate if a more complex game state management beyond individual player records and BullMQ is needed. For now, BullMQ handles timed state changes.
-   [ ] **Player Statuses:**
    -   [ ] Ensure `player.status` enum/type is well-defined (e.g., `idle`, `exploring`, `travelling`, `battling`, `crafting`).
    -   [ ] Consistently update and check this status before allowing actions.

---

## Phase 3: Gameplay Features - Mechanics Implementation (TDD Approach for all features) ⚔️🧪

### 3.1. Exploration System
-   [ ] **Static Data: Exploration Outcomes (`explorationOutcomes.json` or defined per area in `areas.json`):**
    -   [ ] Define possible outcomes for exploring a specific area type or area ID (e.g., find item, trigger event, encounter hostile, nothing). Include probabilities.
        * Example for a forest area: `[{ "type": "find_item", "itemId": 101, "quantity": 1, "chance": 0.3 }, { "type": "hostile_encounter", "hostileId": 201, "chance": 0.4 }, { "type": "nothing", "chance": 0.3 }]`
-   [ ] **Exploration Service Module (`explorationService.ts`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] `resolveExploration(playerId, areaId)`:
            -   [ ] Check if area is explorable.
            -   [ ] Use probabilities to determine outcome (item, event, hostile, nothing).
            -   [ ] If item found, call `inventoryService.addItemToInventory`.
            -   [ ] If hostile encounter, trigger battle initiation (Phase 3.2).
            -   [ ] If event, trigger event (Phase 3.5).
            -   [ ] Return outcome description.
    -   [ ] **Implementation:**
        -   [ ] Implement the logic.
-   [ ] **Explore Command (`/explore`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] Check player status (not travelling, not battling).
        -   [ ] Get player's current area.
        -   [ ] Call `explorationService.resolveExploration`.
        -   [ ] Send result message to player.
        -   [ ] (Optional) Add a short cooldown for exploration using BullMQ if desired.
    -   [ ] **Implementation:**
        -   [ ] Implement the command logic.

### 3.2. Combat System (Turn-Based)
-   [ ] **Static Data: Hostiles (`hostiles.json`):**
    -   [ ] Define hostile creature details (ID, name, level, hp, mp, attack, defense, abilities, loot_table_id).
        * Example: `[{ "id": 201, "name": "Forest Wolf", "level": 3, "hp": 50, "attack": 8, "loot_table_id": 1 }]`
-   [ ] **Static Data: Loot Tables (`lootTables.json`):**
    -   [ ] Define loot drops (loot_table_id, item_id, quantity, drop_chance).
-   [ ] **Battle State Management:**
    -   [ ] Schema/structure for active battles (e.g., `battle_id`, `player_id`, `hostile_id`, `player_current_hp`, `hostile_current_hp`, `current_turn (player/hostile)`). Store in Redis for quick access or a dedicated table.
    -   [ ] Update player status to "battling".
-   [ ] **Battle Service Module (`battleService.ts`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] `initiateBattle(playerId, hostileId)`: Sets up battle state, updates player status.
        -   [ ] `getPlayerBattleState(playerId)`
        -   [ ] `performPlayerAttack(playerId)`: Calculates damage, updates battle state.
        -   [ ] `performHostileAttack(battleId)`: Calculates damage, updates battle state.
        -   [ ] `useSkill(playerId, skillId)` (basic stub for now).
        -   [ ] `fleeBattle(playerId)`: Chance-based, updates player status.
        -   [ ] `endBattle(battleId, outcome (win/loss/flee))`: Grants XP, loot (on win), updates player status.
        -   [ ] `calculateDamage(attackerStats, defenderStats, skillUsed (optional))`
        -   [ ] `processLootDrop(playerId, hostileId)`
    -   [ ] **Implementation:**
        -   [ ] Implement turn logic, damage calculation, skill effects (basic), loot distribution.
-   [ ] **Battle Commands:**
    -   [ ] `/attack`:
        -   [ ] Check if in battle.
        -   [ ] Call `battleService.performPlayerAttack`.
        -   [ ] Trigger hostile turn.
        -   [ ] Send turn summary.
    -   [ ] `/skill <skill_name>` (placeholder, actual skills later).
    -   [ ] `/flee`:
        -   [ ] Call `battleService.fleeBattle`.
        -   [ ] Send result.
-   [ ] **Hostile AI (Simple):**
    -   [ ] Basic logic for hostile actions (e.g., always attack).
    -   [ ] Integrate into `battleService.performHostileAttack`.

### 3.3. Item System Enhancements
-   [ ] **Item Usage (`/use <item_name>`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] Check if player has item.
        -   [ ] Check if item is usable (e.g., consumable).
        -   [ ] Apply item effect (e.g., heal player, grant buff) based on `items.json` definition.
        -   [ ] Call `inventoryService.removeItemFromInventory`.
        -   [ ] Send confirmation.
    -   [ ] **Implementation:**
        -   [ ] Implement command and link to `inventoryService` and `playerService`.
-   [ ] **Equipment System (Guard, Hunter focus):**
    -   [ ] Add `equipped_items` (weapon, armor slots) to player schema.
    -   [ ] Modify player stats based on equipped items.
    -   [ ] `/equip <item_name>` and `/unequip <slot>` commands.
    -   [ ] Update tests for player stats and combat calculations.

### 3.4. Job-Specific Abilities & Crafting (Blacksmith, Pharmacist)
-   [ ] **Static Data: Recipes (`recipes.json`):**
    -   [ ] Define crafting recipes (recipe_id, crafted_item_id, required_materials (item_id, quantity), required_job_class_id, crafting_time_seconds).
-   [ ] **Crafting Service Module (`craftingService.ts`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] `canCraft(playerId, recipeId)`: Checks job, materials, level (if any).
        -   [ ] `startCrafting(playerId, recipeId)`:
            -   [ ] Deduct materials using `inventoryService`.
            -   [ ] Add job to BullMQ for `crafting_completion`.
            -   [ ] Update player status (e.g., "crafting").
        -   [ ] `getAvailableRecipes(playerId)`
    -   [ ] **Implementation:**
        -   [ ] Implement logic.
-   [ ] **Crafting Completion Worker (`craftingWorker.ts`):**
    -   [ ] **Function Stubs & Tests (for job processor):**
        -   [ ] `processCraftingCompletion(job)`:
            -   [ ] Get player, recipe.
            -   [ ] Add crafted item to inventory using `inventoryService`.
            -   [ ] Update player status.
            -   [ ] Send crafting completion message.
    -   [ ] **Implementation:**
        -   [ ] Implement BullMQ job processor.
-   [ ] **Crafting Command (`/craft <recipe_name>`):**
    -   [ ] Implement command logic.
-   [ ] **Basic Skill System (All classes):**
    -   [ ] Static Data: `skills.json` (skill_id, name, description, effect, job_class_id, level_required).
    -   [ ] Integrate skill usage into combat (`/skill` command enhancement).

### 3.5. Event System (Simple)
-   [ ] **Static Data: Events (`events.json`):**
    -   [ ] Define simple events (event_id, description, choices (optional), outcomes).
-   [ ] **Event Service Module (`eventService.ts`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] `triggerEvent(playerId, eventId)`
        -   [ ] `resolveEventChoice(playerId, eventId, choiceId)`
    -   [ ] **Implementation:**
        -   [ ] Implement logic to present event text and process outcomes (e.g., give item, change stat, trigger another event).
-   [ ] **Integration with Exploration:**
    -   [ ] `explorationService` can trigger events.

### 3.6. Shop System
-   [ ] **Static Data: Shops (`shops.json`):**
    -   [ ] Define shop inventories (shop_id, item_id, buy_price, sell_price, stock (optional)). Link shops to areas.
-   [ ] **Shop Service Module (`shopService.ts`):**
    -   [ ] **Function Stubs & Tests:**
        -   [ ] `getShopInventory(areaId)`
        -   [ ] `buyItem(playerId, itemId, quantity)`: Check currency, add to inventory, deduct currency.
        -   [ ] `sellItem(playerId, itemId, quantity)`: Check inventory, remove from inventory, add currency.
    -   [ ] **Implementation:**
        -   [ ] Add `currency` field to player schema.
-   [ ] **Shop Commands (`/shop`, `/buy <item> <qty>`, `/sell <item> <qty>`):**
    -   [ ] Implement command logic.

---

## Phase 4: Content Population 🌍

-   [ ] **Finalize Static Data JSON files:**
    -   [ ] `items.json`: Comprehensive list of all items.
    -   [ ] `hostiles.json`: Diverse set of enemies for different areas.
    -   [ ] `areas.json`: Define all game world locations.
    -   [ ] `travelRoutes.json`: Complete travel network.
    -   [ ] `jobClasses.json`: Refine base stats and ability names.
    -   [ ] `skills.json`: Define skills for each class.
    -   [ ] `recipes.json`: Crafting recipes for Blacksmith and Pharmacist.
    -   [ ] `lootTables.json`: Assign loot to all hostiles.
    -   [ ] `explorationOutcomes.json`: Populate outcomes for all explorable areas.
    -   [ ] `events.json`: Create a variety of simple events.
    -   [ ] `shops.json`: Set up shops in towns with appropriate items.
-   [ ] **Review and Balance:**
    -   [ ] Review item stats, hostile difficulty, XP progression, economy (prices, loot value).
    -   [ ] Basic playtesting to identify glaring imbalances.

---

## Phase 5: Testing, Refinement & Deployment 🚀

### 5.1. Comprehensive Testing
-   [ ] **Unit Tests:** Ensure all services and utility functions have thorough unit tests.
-   [ ] **Integration Tests:**
    -   [ ] Test interactions between services (e.g., exploration leading to combat, crafting consuming items and producing new ones).
    -   [ ] Test BullMQ job processing flows end-to-end (command -> job -> worker -> player update -> notification).
    -   [ ] Test full command flows with database interactions.
-   [ ] **End-to-End (E2E) Testing (Simulated):**
    -   [ ] Write scripts or manual test plans for common player journeys (e.g., create character -> travel -> explore -> fight -> loot -> craft -> sell).
-   [ ] **Stress Testing (Basic):**
    -   [ ] Simulate multiple concurrent users if possible (consider tools or simple scripts). (Optional for early stage)

### 5.2. Refinement & Optimization
-   [ ] **Code Review:** Conduct thorough code reviews.
-   [ ] **Refactor:** Address any `TODOs`, improve code clarity, and optimize critical paths.
-   [ ] **Database Query Optimization:** Analyze and optimize slow Kysely queries if any.
-   [ ] **Error Handling & Logging:**
    -   [ ] Implement robust error handling for all commands and services.
    -   [ ] Setup structured logging (e.g., Pino) for easier debugging in production.
-   [ ] **Security Review:**
    -   [ ] Check for common vulnerabilities (input validation, etc.).
    -   [ ] Ensure sensitive data (like bot token) is handled securely.

### 5.3. Documentation
-   [ ] **User Guide (Basic):** How to play, list of commands.
-   [ ] **Developer Documentation:** Update `README.md` with setup, architecture overview, and contribution guidelines.
-   [ ] Document static data JSON structures.

### 5.4. Deployment
-   [ ] **Production Docker Configuration:**
    -   [ ] Optimize Dockerfile for production (multi-stage builds, non-root user).
    -   [ ] Secure environment variable management (e.g., Docker secrets, Vault, or platform-specific solution).
-   [ ] **Deployment Strategy:**
    -   [ ] Choose a deployment platform (e.g., VPS, cloud provider like AWS/GCP/Azure, Fly.io, Railway).
    -   [ ] Set up CI/CD pipeline (e.g., GitHub Actions) to automate testing and deployment.
-   [ ] **Monitoring & Alerting:**
    -   [ ] Set up basic monitoring for the application, database, and Redis.
    -   [ ] Configure alerts for critical errors or downtime.

---

**Reminder:** This is a comprehensive list. Prioritize features based on what delivers the most value early on (Minimum Viable Product). Continuously refer to and update `copilot-notes.md` with your learnings. Good luck!
