import { pgTable, text, uuid , timestamp, pgEnum} from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp("createdAt")
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt")
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
