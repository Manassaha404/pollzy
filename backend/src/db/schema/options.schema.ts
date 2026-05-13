import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { questions } from "./question.schema.js";


export const options = pgTable(
  "options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .references(() => questions.id, {
        onDelete: "cascade",
      })
      .notNull(),
    text: varchar("text", { length: 1000 }).notNull(),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
);