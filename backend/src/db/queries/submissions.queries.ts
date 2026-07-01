import { submissions } from "../schema.js";
import db from "../index.js";
import { eq } from "drizzle-orm";

//@ts-ignore
export const createSubmission = async (data) => {
  const result = await db.insert(submissions).values(data).returning();
  return result[0];
};

//@ts-ignore
export const getSubmission = async (submissionId) => {
  const result = await db.select().from(submissions).where(eq(submissions.id, submissionId));
  return result[0];
};