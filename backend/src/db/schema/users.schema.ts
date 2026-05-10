import { integer, pgTable, timestamp, uuid, varchar, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  firstName: varchar("first_name", { length: 200 }).notNull(),
  lastName: varchar("last_name", { length: 200 }).notNull(),

  email: varchar("email", { length: 322 }).notNull().unique(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
},
(pg) => [
  uniqueIndex("user_idx").on(pg.id),
  uniqueIndex("user_email_idx").on(pg.email),
]); 