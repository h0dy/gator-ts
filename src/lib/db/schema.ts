import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});

export type User = typeof users.$inferInsert;

export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
  url: text("url").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type Feed = typeof feeds.$inferInsert;

export const feedsFollows = pgTable(
  "feeds_follows",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
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
  (t) => [unique().on(t.feedId, t.userId)]
);
