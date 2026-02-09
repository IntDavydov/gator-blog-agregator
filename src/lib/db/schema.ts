import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uuid,
  text,
  primaryKey,
} from "drizzle-orm/pg-core";

export type User = InferSelectModel<typeof users>;
export type Feed = InferSelectModel<typeof feeds>;
export type FeedFollow = InferSelectModel<typeof feedFollows>;
export type Post = InferSelectModel<typeof posts>; // all fields
export type NewPost = InferInsertModel<typeof posts>; // exclude default fields

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
  lastFetchedAt: timestamp("last_fetched_at"),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const feedFollows = pgTable(
  "feed_follows",
  {
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
  },
  (tabel) => [primaryKey({ columns: [tabel.userId, tabel.feedId] })],
);

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  title: text("title").notNull(),
  link: text("link").notNull().unique(),
  description: text("description"),
  pubDate: timestamp("published_at").notNull(),
  feedId: uuid("feed_id").notNull(),
});
