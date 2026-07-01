import { submissions } from "../schema.js";
import db from "../index.js";
import { eq } from "drizzle-orm";

//@ts-ignore
export const createSubmission = async (data) => {
  const result = await db.insert(submissions).values(data).returning();
  return result[0];
};

//@ts-ignore
export const getSubmissionByIdQuery = async (submissionId) => {
  const result = await db.select().from(submissions).where(eq(submissions.id, submissionId));
  return result[0];
};

//@ts-ignore
export const getSubmissionsQuery = async (userId) => {
  const result = await db.select().from(submissions).where(eq(submissions.userId, userId));
  return result;
};

//@ts-ignore
export const getSubmissionsByProblemIdQuery = async (problemId) => {
  const result = await db.select().from(submissions).where(eq(submissions.problemId, problemId));
  return result;
};