import type { Request, Response } from "express";
import { getSubmissionByIdQuery, getSubmissionsByProblemIdQuery, getSubmissionsQuery } from "../db/queries/submissions.queries.js";

export const getAllSubmissions = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      const resPayload: ApiResponse<null> = {
        status: 401,
        success: false,
        data: null,
        message: "Unauthorized",
      };
      return res.status(resPayload.status).json(resPayload);
    }
    const submissions = await getSubmissionsQuery(userId);
    if(!submissions || submissions.length === 0) {
      const resPayload: ApiResponse<null> = {
        status: 404,
        success: false,
        data: null,
        message: "No submissions found",
      };
      return res.status(resPayload.status).json(resPayload);
    }
    const resPayload: ApiResponse<typeof submissions> = {
      status: 200,
      success: true,
      data: submissions,
      message: "Submissions retrieved successfully",
    };
    return res.status(resPayload.status).json(resPayload);
  } catch (error) {
    console.error(error);
    const resPayload: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    };
    return res.status(resPayload.status).json(resPayload);
  }
};

export const getSubmissionById = async (req: Request, res: Response) => {
  try {
    const submissionId = req.params.id;
    if (!submissionId) {
      const resPayload: ApiResponse<null> = {
        status: 400,
        success: false,
        data: null,
        message: "Bad request",
      };
      return res.status(resPayload.status).json(resPayload);
    }
    const submission = await getSubmissionByIdQuery(submissionId);
    if(!submission) {
      const resPayload: ApiResponse<null> = {
        status: 404,
        success: false,
        data: null,
        message: "Submission not found",
      };
      return res.status(resPayload.status).json(resPayload);
    }
    const resPayload: ApiResponse<typeof submission> = {
      status: 200,
      success: true,
      data: submission,
      message: "Submission retrieved successfully",
    };
    return res.status(resPayload.status).json(resPayload);
  } catch (error) {
    console.error(error);
    const resPayload: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    };
    return res.status(resPayload.status).json(resPayload);
  }
};

export const getAllSubmissionsByProblemId = async (req: Request, res: Response) => {
  try {
    const problemId = req.params.problemId;
    if (!problemId) {
      const resPayload: ApiResponse<null> = {
        status: 400,
        success: false,
        data: null,
        message: "Bad request",
      };
      return res.status(resPayload.status).json(resPayload);
    }
    const submissions = await getSubmissionsByProblemIdQuery(problemId);
    if(!submissions || submissions.length === 0) {
      const resPayload: ApiResponse<null> = {
        status: 404,
        success: false,
        data: null,
        message: "No submissions found",
      };
      return res.status(resPayload.status).json(resPayload);
    }
    const resPayload: ApiResponse<typeof submissions> = {
      status: 200,
      success: true,
      data: submissions,
      message: "Submissions retrieved successfully",
    };
    return res.status(resPayload.status).json(resPayload);
  } catch (error) {
    console.error(error);
    const resPayload: ApiResponse<null> = {
      status: 500,
      success: false,
      data: null,
      message: "Internal server error",
    };
    return res.status(resPayload.status).json(resPayload);
    }
};