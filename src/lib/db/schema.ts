import { InferSelectModel } from "drizzle-orm";
import { pgTable, timestamp, uuid, text } from "drizzle-orm/pg-core";

export type User = InferSelectModel<typeof users>;

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(), // uuid is a string
  createdAt: timestamp("created_at").notNull().defaultNow(), // timestamp is a Date object
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("create_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
  url: text("url").notNull().unique(),
  user_id: text("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
});