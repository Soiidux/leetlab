import {
  pgTable,
  text,
  uuid,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import type { InferInsertModel } from "drizzle-orm";

export const timestamps = {
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const roleEnum = pgEnum("role", ["ADMIN", "USER"]);
export const difficultyEnum = pgEnum("difficulty", ["EASY", "MEDIUM", "HARD"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image"),
  password: text("password").notNull(),
  role: roleEnum("role").default("USER").notNull(),
  ...timestamps,
});

export const problems = pgTable("problems", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: difficultyEnum("difficulty").notNull(),
  tags: text("tags").array().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id),
  examples: jsonb("examples").notNull(),
  constraints: text("constraints").array().notNull(),
  hints: text("hints").array(),
  editorial: text("editorial"),
  testCases: jsonb("testCases").notNull(),
  codeSnippets: jsonb("codeSnippets").notNull(),
  referenceSolutions: jsonb("referenceSolutions").notNull(),
  ...timestamps,
});

export type Problem = InferInsertModel<typeof problems>;
