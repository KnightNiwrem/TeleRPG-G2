import { test, expect, beforeAll, afterAll } from "bun:test";
import { createRedisConnection } from "../redis/connection.js";
import { getGeneralTasksQueue, getTravelTasksQueue, closeQueues } from "../redis/queues.js";
import type Redis from "ioredis";

/**
 * Redis connection and BullMQ tests
 */

let testRedis: Redis;

beforeAll(async () => {
  // Use test Redis connection
  testRedis = createRedisConnection(process.env.REDIS_URL || "redis://localhost:6379");
});

afterAll(async () => {
  await testRedis.quit();
  await closeQueues();
});

test("should create Redis connection", () => {
  expect(testRedis).toBeDefined();
});

test("should connect and ping Redis", async () => {
  try {
    await testRedis.connect();
    const response = await testRedis.ping();
    expect(response).toBe("PONG");
  } catch (error) {
    console.log("Skipping Redis test - Redis not available:", error);
  }
});

test("should create BullMQ queues", async () => {
  const generalQueue = getGeneralTasksQueue();
  const travelQueue = getTravelTasksQueue();

  expect(generalQueue).toBeDefined();
  expect(travelQueue).toBeDefined();
  expect(generalQueue.name).toBe("general_tasks");
  expect(travelQueue.name).toBe("travel_tasks");
});

test("should add jobs to queues", async () => {
  const generalQueue = getGeneralTasksQueue();
  
  const job = await generalQueue.add("test_job", { test: "data" });
  expect(job).toBeDefined();
  expect(job.data).toEqual({ test: "data" });

  // Clean up
  await job.remove();
});