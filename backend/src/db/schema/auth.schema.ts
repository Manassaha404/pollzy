import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  pgEnum,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const rolesEnum = pgEnum("roles", [
  "user"
]);

export const auths = pgTable("auths", {


  id: uuid("id").primaryKey().defaultRandom(),
  password: varchar("password", { length: 255 }).notNull(),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "cascade"
  }).notNull(),
  
  
  refreshToken: varchar("refresh_token"),

  verificationOtp: varchar("verification_otp"),
  role: rolesEnum("roles").default("user").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
},
(pg) => [
  uniqueIndex("auth_idx").on(pg.id),
]);