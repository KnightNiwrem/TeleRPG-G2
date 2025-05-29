import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

/**
 * Database table schemas using Kysely types
 */

export interface Database {
  players: PlayersTable;
  player_inventory: PlayerInventoryTable;
  game_areas: GameAreasTable;
}

export interface PlayersTable {
  id: Generated<number>;
  telegram_id: string;
  character_name: string;
  job_class_id: number;
  level: number;
  experience: number;
  hp: number;
  max_hp: number;
  mp: number;
  max_mp: number;
  attack: number;
  defense: number;
  current_area_id: number;
  status: "idle" | "travelling" | "battling" | "crafting" | "exploring";
  destination_area_id: number | null;
  travel_finish_time: ColumnType<Date, string | Date, string | Date> | null;
  currency: number;
  created_at: ColumnType<Date, never, never>;
  updated_at: ColumnType<Date, never, string | Date>;
  last_login: ColumnType<Date, string | Date, string | Date>;
}

export interface PlayerInventoryTable {
  id: Generated<number>;
  player_id: number;
  item_id: number;
  quantity: number;
  created_at: ColumnType<Date, never, never>;
  updated_at: ColumnType<Date, never, string | Date>;
}

export interface GameAreasTable {
  id: Generated<number>;
  name: string;
  type: string;
  description: string;
  explorable: boolean;
  shop_id: number | null;
  created_at: ColumnType<Date, never, never>;
  updated_at: ColumnType<Date, never, string | Date>;
}

// Type helpers for CRUD operations
export type Player = Selectable<PlayersTable>;
export type NewPlayer = Insertable<PlayersTable>;
export type PlayerUpdate = Updateable<PlayersTable>;

export type PlayerInventory = Selectable<PlayerInventoryTable>;
export type NewPlayerInventory = Insertable<PlayerInventoryTable>;
export type PlayerInventoryUpdate = Updateable<PlayerInventoryTable>;

export type GameArea = Selectable<GameAreasTable>;
export type NewGameArea = Insertable<GameAreasTable>;
export type GameAreaUpdate = Updateable<GameAreasTable>;