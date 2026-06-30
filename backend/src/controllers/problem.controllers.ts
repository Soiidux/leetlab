import type { Request, Response } from "express";
import { getJudge0LangId, submitBatch, pollBatchResults } from "../libs/judge0.lib.js";
import { createProblemQuery, getProblemsQuery, getProblemByIdQuery, updateProblemQuery, deleteProblemQuery } from "../db/queries/problems.queries.js";
import { validate as isUUID } from "uuid";
import type { Problem } from "../db/schema.js";
import { updateProblemSchema } from "../libs/zod.lib.js";

export const createProblem = async (req: Request, res: Response) => {
    //get all data from req body
  const { title, description, difficulty, tags, examples, constraints, hints, editorial, testCases, codeSnippets, referenceSolutions } = req.body;
  const user: User = req.user;  
  if (!user) {
    const resPayload: ApiResponse<null> = {
      status: 401,
      success: false,
      data: null,
      message: "Unauthorized",
    }
    return res.status(401).json(resPayload);
  }
  //check if admin
  if (user.role !== "ADMIN") {
    const resPayload: ApiResponse<null> = {
      status: 403,
      success: false,
      data: null,
      message: "Forbidden",
    }
    return res.status(403).json(resPayload);
  }
  // loop through each reference solution for different languages (get judge0 lang id for the current language, prepare judge0 submission for all testcases)
  try {
    for(const [language,solutionCode] of Object.entries(referenceSolutions)) {
      const langId = await getJudge0LangId(language);
      if (!langId) {
        const resPayload: ApiResponse<null> = {
          status: 400,
          success: false,
          data: null,
          message: `Unsupported language: ${language}`,
        }
        return res.status(400).json(resPayload);
      }
      //@ts-ignore
      const submissions = testCases.map(({ input, output }) => {
        return {
          source_code: solutionCode,
          language_id: langId,
          stdin: input,
          expected_output: output,
        }
      });
      const submissionResults = await submitBatch(submissions);
      const tokens = submissionResults.map((result: any) => result.token);

      const results = await pollBatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if(result.status.id !== 3) {
          const resPayload: ApiResponse<null> = {
            status: 400,
            success: false,
            data: null,
            message: `Submission ${i + 1} failed for language ${language}`,
          }
          return res.status(400).json(resPayload);
        }
      }
    }

    const newProblem = await createProblemQuery({
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
      userId: req.user?.id ?? "",
    });
    
    const resPayload: ApiResponse<typeof newProblem> = {
      status: 201,
      success: true,
      data: newProblem,
      message: "Problem created successfully, all testcases passed",
    }
    return res.status(201).json(resPayload);
  } catch (error) {
    console.error("Error while creating problem: ", error);
    const resPayload: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    }
    return res.status(500).json(resPayload);
  }
};

export const getProblemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if(!id || typeof id !== "string" || !isUUID(id)) {
      const resPayload: ApiResponse<null> = {
        status: 400,
        success: false,
        data: null,
        message: "Invalid problem id",
      }
      return res.status(400).json(resPayload);
    }
    const problem = await getProblemByIdQuery(id);
    if(!problem) {
      const resPayload: ApiResponse<null> = {
        status: 404,
        success: false,
        data: null,
        message: "Problem not found",
      }
      return res.status(404).json(resPayload);
    }
    const resPayload: ApiResponse<typeof problem> = {
      status: 200,
      success: true,
      data: problem,
      message: "Problem fetched successfully",
    }
    return res.status(200).json(resPayload);
  } catch (error) {
    console.error("Error while fetching problem: ", error);
    const resPayload: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    }
    return res.status(500).json(resPayload);
  }
};

export const getProblems = async (req: Request, res: Response) => {
  try {
    const problems = await getProblemsQuery();
    const resPayload: ApiResponse<{ count: number; problems: typeof problems }> = {
      status: 200,
      success: true,
      data: {
        count: problems.length,
        problems,
      },
      message: "Problems fetched successfully",
    }
    return res.status(200).json(resPayload);
  } catch (error) {
    console.error("Error while fetching problems: ", error);
    const resPayload: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    }
    return res.status(500).json(resPayload);
  }
};

export const updateProblem = async (req: Request, res: Response) => {
  const { id } = req.params;
  if(!id || typeof id !== "string" || !isUUID(id) ) {
    const resPayload: ApiResponse<null> = {
      status: 400,
      success: false,
      data: null,
      message: "Invalid UUID",
    }
    return res.status(400).json(resPayload);
  }
  const updateData = updateProblemSchema.parse(req.body);
  const cleanUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(
      ([_, value]) => value !== undefined
    )
  );
  if (Object.keys(updateData).length === 0) {
    const apiPayload: ApiResponse<null> = {
      status: 400,
      data: null,
      success: false,
      message: "No fields provided for update",
    };
    return res.status(400).json(apiPayload);
  }
  const user: User = req.user;  
  if (!user) {
    const resPayload: ApiResponse<null> = {
      status: 401,
      success: false,
      data: null,
      message: "Unauthorized",
    }
    return res.status(401).json(resPayload);
  }
  //check if admin
  if (user.role !== "ADMIN") {
    const resPayload: ApiResponse<null> = {
      status: 403,
      success: false,
      data: null,
      message: "Forbidden",
    }
    return res.status(403).json(resPayload);
  }

  const problem = await getProblemByIdQuery(id);
  if(!problem) {
    const resPayload: ApiResponse<null> = {
      status: 404,
      success: false,
      data: null,
      message: "Problem not found",
    }
    return res.status(404).json(resPayload);
  }
  const referenceSolutions =
    (cleanUpdateData.referenceSolutions ??
      problem.referenceSolutions) as Record<string, string>;
  const testCases =
    (cleanUpdateData.testCases ??
      problem.testCases) as Record<string, string>[];

  try {
    if(cleanUpdateData.testCases || cleanUpdateData.referenceSolutions) {
      for(const [language,solutionCode] of Object.entries(referenceSolutions)) {
        const langId = await getJudge0LangId(language);
        if (!langId) {
          const resPayload: ApiResponse<null> = {
            status: 400,
            success: false,
            data: null,
            message: `Unsupported language: ${language}`,
          }
          return res.status(400).json(resPayload);
        }
        //@ts-ignore
        const submissions = testCases.map(({ input, output }) => {
          return {
            source_code: solutionCode,
            language_id: langId,
            stdin: input,
            expected_output: output,
          }
        });
        const submissionResults = await submitBatch(submissions);
        const tokens = submissionResults.map((result: any) => result.token);
  
        const results = await pollBatchResults(tokens);
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          if(result.status.id !== 3) {
            const resPayload: ApiResponse<null> = {
              status: 400,
              success: false,
              data: null,
              message: `Submission ${i + 1} failed for language ${language}`,
            }
            return res.status(400).json(resPayload);
          }
        }
      }
    }
    const updatedProblem = await updateProblemQuery(id, cleanUpdateData);
    if (!updatedProblem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
        data: null,
      });
    }
    const resPayload: ApiResponse<Problem> = {
      status: 200,
      success: true,
      data: updatedProblem,
      message: "Problem updated successfully",
    }
    return res.status(200).json(resPayload);
  } catch (error) {
    console.error("Error while updating problem", error);
    const resPayload: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    }
    return res.status(500).json(resPayload);
  }
};

export const deleteProblem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if(!id || typeof id !== "string" || !isUUID(id) ) {
      const resPayload: ApiResponse<null> = {
        status: 400,
        success: false,
        data: null,
        message: "Invalid UUID",
      }
      return res.status(400).json(resPayload);
    }
    const result = await deleteProblemQuery(id);
    if(!result) {
      const resPayload: ApiResponse<null> = {
        status: 404,
        success: false,
        data: null,
        message: "Problem not found",
      }
      return res.status(404).json(resPayload);
    }
    const resPayload: ApiResponse<typeof result> = {
      status: 200,
      success: true,
      data: result,
      message: "Problem deleted successfully",
    }
    return res.status(200).json(resPayload);
  } catch (error) {
    console.error("Error while deleting problem: ", error);
    const resPayload: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    }
    return res.status(500).json(resPayload);
  }
};
