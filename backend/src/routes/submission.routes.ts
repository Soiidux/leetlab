import { Router } from "express";
import { getAllSubmissions, getSubmissionById, getAllSubmissionsByProblemId } from "../controllers/submission.controllers.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
const submissionRouter = Router();

submissionRouter.get("/", authMiddleware, getAllSubmissions);
submissionRouter.get("/:id", authMiddleware, getSubmissionById);
submissionRouter.get("/problem/:problemId", authMiddleware, getAllSubmissionsByProblemId);

export default submissionRouter;