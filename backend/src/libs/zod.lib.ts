import { z } from "zod";

export const updateProblemSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  tags: z.array(z.string()).optional(),
  examples: z.json().optional(),
  constraints: z.array(z.string()).optional(),
  hints: z.array(z.string()).optional(),
  editorial: z.string().optional(),
  testCases: z.json().optional(),
  codeSnippets: z.json().optional(),
  referenceSolutions: z.json().optional(),
});