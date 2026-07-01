import {
  pgTable,
  text,
  uuid,
  integer,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
  index,
  unique,
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

export const submissions = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: uuid("userId")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  problemId: uuid("problemId")
    .notNull()
    .references(() => problems.id, {
      onDelete: "cascade",
    }),

  sourceCode: jsonb("sourceCode").notNull(),

  language: text("language").notNull(),

  stdin: text("stdin"),
  stdout: text("stdout"),
  stderr: text("stderr"),
  compileOutput: text("compileOutput"),

  status: text("status").notNull(),

  memory: text("memory"),
  time: text("time"),

  ...timestamps,
});

export const testCaseResults = pgTable(
  "test_case_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    submissionId: uuid("submissionId")
      .notNull()
      .references(() => submissions.id, {
        onDelete: "cascade",
      }),

    testCaseNo: integer("testCaseNo").notNull(),  

    passed: boolean("passed").notNull(),

    stdout: text("stdout"),
    expected: text("expected").notNull(),
    stderr: text("stderr"),
    compileOutput: text("compileOutput"),

    status: text("status").notNull(),

    memory: text("memory"),
    time: text("time"),

    ...timestamps,
  },
  (table) => [
    index("submission_id_idx").on(table.submissionId),
  ]
);

export const problemSolved = pgTable(
  "problem_solved",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("userId")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    problemId: uuid("problemId")
      .notNull()
      .references(() => problems.id, {
        onDelete: "cascade",
      }),

    ...timestamps,
  },
  (table) => [
    unique("user_problem_unique").on(
      table.userId,
      table.problemId
    ),
  ]
);
export type Problem = InferInsertModel<typeof problems>;
