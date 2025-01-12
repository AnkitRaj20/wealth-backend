// utils/redis.js
import { createClient } from "@redis/client";

const redisClient = createClient({
  url: "redis://localhost:6060", // Ensure the correct URL for Redis instance
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

await redisClient.connect(); // Ensure Redis client connects properly

export default redisClient;
