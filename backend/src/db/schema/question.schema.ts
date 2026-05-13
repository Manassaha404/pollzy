import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
  boolean,
  Index,
} from "drizzle-orm/pg-core";
import { polls } from "./poll.schema.js";

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pollId: uuid("poll_id")
      .references(() => polls.id, {
        onDelete: "cascade",
      })
      .notNull(),
    orderIndex: integer("order_index").notNull(),
    isRequired: boolean("is_required").default(false).notNull(),
    text: varchar("text", { length: 1000 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
);
