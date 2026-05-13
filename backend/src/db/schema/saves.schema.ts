import {
  pgTable,
  timestamp,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { questions } from "./question.schema.js";
import { users } from "./users.schema.js";

export const saves = pgTable(
  "saves",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pollId: uuid("poll_id")
      .references(() => questions.pollId, {
        onDelete: "cascade",
      })
      .notNull(),

    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),
    savedAt: timestamp("saved_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (pg) => [uniqueIndex("save_idx").on(pg.userId, pg.pollId)],
);
