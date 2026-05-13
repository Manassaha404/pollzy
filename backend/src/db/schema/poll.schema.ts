import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema.js";

export const pollStatusEnum = pgEnum("poll_status", [
  "active",
  "closed",
  "draft",
]);

export const resultVisibilityEnum = pgEnum("result_visibility", [
  "always",
  "after_vote",
  "creator_only",
]);

export const polls = pgTable("polls", {
  id: uuid("id").primaryKey().defaultRandom(),
  creatorId: uuid("creator_id")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: varchar("description", { length: 1000 }),
  isPublic: boolean("is_public").default(false).notNull(),
  status: pollStatusEnum("status").default("draft").notNull(),
  resultVisibility: resultVisibilityEnum("result_visibility")
    .default("after_vote")
    .notNull(),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});
