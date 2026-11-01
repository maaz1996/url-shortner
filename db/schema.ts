import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const urls = pgTable("urls", {
  id: serial().primaryKey(),
  longurl: text().notNull(),
  urlcode: text().notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
