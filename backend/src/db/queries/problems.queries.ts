import db from "../index.js";
import { problems } from "../schema.js";
import type { Problem } from "../schema.js";
import { eq } from "drizzle-orm";

export const createProblemQuery = async (problem: Problem) => {
  const result = await db.insert(problems).values(problem).returning();
  return result[0];
}

export const getProblemsQuery = async () => {
  const result = await db.select().from(problems);
  return result;
}

export const getProblemByIdQuery = async (id: string) => {
  try {
    const result = await db.select().from(problems).where(eq(problems.id, id));
    return result[0];
  } catch (error) {
    throw error;
  }
}

export const updateProblemQuery = async (id: string, data: Partial<Problem>) => {
  const result = await db.update(problems).set(data).where(eq(problems.id, id)).returning();
  return result[0];
}

export const deleteProblemQuery = async (id: string) => {
  const result = await db.delete(problems).where(eq(problems.id, id)).returning();
  return result[0];
}