import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { questions } from "./question.schema.js";
import { users } from "./users.schema.js";

export const viwes = pgTable(
  "viwes",
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
      }),
    guestToken: varchar("guest_token"),
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
);
