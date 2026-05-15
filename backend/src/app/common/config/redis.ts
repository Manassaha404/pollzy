import { Redis } from "ioredis";
import { env } from "./envValidate.js";

const createRedisConnection = () => {
  return new Redis({
    host: env.REDIS_HOST,
    port: Number(env.REDIS_PORT),
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
  });
};

export const publisher = createRedisConnection();
export const subscriber = createRedisConnection();
