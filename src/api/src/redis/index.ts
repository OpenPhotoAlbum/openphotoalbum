import dotenv from "dotenv";
import * as redis from "redis";
import connectRedis from "connect-redis";

dotenv.config({ path: '/home/openphoto/config/.env.local' });

const redis_url = `redis://127.0.0.1:${process.env.REDIS_PORT}`;

const redisClient = redis.createClient({ url: redis_url });

redisClient.connect().catch(console.error);

const store = new connectRedis({
    client: redisClient,
    prefix: "photogate:",
});

export { redisClient, store };