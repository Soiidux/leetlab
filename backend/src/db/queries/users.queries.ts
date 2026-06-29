import db from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";

export const getUserByEmail = async ({ email }: { email: string }) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  return result[0];
};

export const getUserById = async ({ id }: { id: string }) => {
  const result = await db
    .select(
      { id: users.id, name: users.name, email: users.email, image: users.image, role: users.role, createdAt: users.createdAt, updatedAt: users.updatedAt }
    )
    .from(users)
    .where(eq(users.id, id));

  return result[0];
};

export const createUser = async ({ email, password, name }: { email: string; password: string; name: string }) => {
  const result = await db.insert(users).values({ email, password, name }).returning(
    { id: users.id, name: users.name, email: users.email, image: users.image, role: users.role, createdAt: users.createdAt, updatedAt: users.updatedAt }
  );
  return result[0];
}
