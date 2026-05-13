import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";

import { questions } from "./question.schema.js";
import { options } from "./options.schema.js";
import { users } from "./users.schema.js";

export const votes = pgTable(
  "votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .references(() => questions.id, {
        onDelete: "cascade",
      })
      .notNull(),
    optionId: uuid("option_id")
      .references(() => options.id, {
        onDelete: "cascade",
      })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    guestToken: varchar("guest_token"),
    votedAt: timestamp("voted_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (pg) => [
    uniqueIndex("user_question_idx").on(pg.userId, pg.questionId),
  ],
);
