import { testCaseResults } from "../schema.js";
import db from "../index.js";
import { eq } from "drizzle-orm";

//@ts-ignore
export const createTestCaseResult = async (data) => {
  const result = await db.insert(testCaseResults).values(data).returning();
  return result[0];
};
//@ts-ignore
export const getTestCaseResults = async (submissionId) => {
  const results = await db.select().from(testCaseResults).where(eq(testCaseResults.submissionId, submissionId));
  return results;
};