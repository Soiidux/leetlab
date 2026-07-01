import { problemSolved } from "../schema.js";
import db from "../index.js";


//@ts-ignore

export const createProblemSolved = async (data) => {
  const result = await db.insert(problemSolved).values(data).onConflictDoNothing().returning();
  return result[0];
};