import { Queue, Worker, Job } from "bullmq";
import { getRedisConnection } from "./connection.js";

/**
 * BullMQ queue and worker setup
 */

export interface TravelCompletionData {
  playerId: number;
  destinationAreaId: number;
}

export interface CraftingCompletionData {
  playerId: number;
  recipeId: number;
  itemId: number;
}

// Queue instances
let generalTasksQueue: Queue | null = null;
let travelTasksQueue: Queue | null = null;

export function getGeneralTasksQueue(): Queue {
  if (!generalTasksQueue) {
    const redis = getRedisConnection();
    generalTasksQueue = new Queue("general_tasks", {
      connection: redis,
    });
  }
  return generalTasksQueue;
}

export function getTravelTasksQueue(): Queue {
  if (!travelTasksQueue) {
    const redis = getRedisConnection();
    travelTasksQueue = new Queue("travel_tasks", {
      connection: redis,
    });
  }
  return travelTasksQueue;
}

// Worker setup (to be implemented in separate files)
export function createWorker(
  queueName: string,
  processor: (job: Job) => Promise<void>
): Worker {
  const redis = getRedisConnection();
  return new Worker(queueName, processor, {
    connection: redis,
  });
}

// Job addition helpers
export async function addTravelJob(
  playerId: number,
  destinationAreaId: number,
  delayMs: number
): Promise<void> {
  const queue = getTravelTasksQueue();
  await queue.add(
    "travel_completion",
    { playerId, destinationAreaId } as TravelCompletionData,
    { delay: delayMs }
  );
}

export async function addCraftingJob(
  playerId: number,
  recipeId: number,
  itemId: number,
  delayMs: number
): Promise<void> {
  const queue = getGeneralTasksQueue();
  await queue.add(
    "crafting_completion",
    { playerId, recipeId, itemId } as CraftingCompletionData,
    { delay: delayMs }
  );
}

// Cleanup
export async function closeQueues(): Promise<void> {
  if (generalTasksQueue) {
    await generalTasksQueue.close();
    generalTasksQueue = null;
  }
  if (travelTasksQueue) {
    await travelTasksQueue.close();
    travelTasksQueue = null;
  }
}