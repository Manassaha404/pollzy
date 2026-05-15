import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("8080"),
  DATABASE_URL: z.string(),
  JWT_ACCESS_TOKEN_SERECT: z.string(),
  JWT_ACCESS_TOKEN_EXPIRY: z.string(),
  JWT_REFRESH_TOKEN_SERECT: z.string(),
  JWT_REFRESH_TOKEN_EXPIRY: z.string(),
  RESEND_API_KEY: z.string(),
  VERIFICATION_TOKEN_SERECT: z.string(),
  VERIFICATION_TOKEN_EXPIRY: z.string(),
  REDIS_HOST:z.string(),
  REDIS_PORT:z.string(),
  REDIS_USERNAME:z.string(),
  REDIS_PASSWORD:z.string(),
  CLIENT_URL:z.string()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
