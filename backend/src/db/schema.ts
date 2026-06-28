import { pgTable, text, integer, varchar, char, uuid , timestamp, pgEnum} from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}

export const roleEnum = pgEnum("role", ["ADMIN", "USER"])

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  image: text("image"),
  password: text("password").notNull(),
  role: roleEnum("role").default("USER").notNull(),
  ...timestamps,
})