import { Router } from "express";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middlewares.js";
import { createProblem, getProblemById, getProblems, updateProblem , deleteProblem} from "../controllers/problem.controllers.js";

const problemRouter = Router();

problemRouter.post("/create", authMiddleware, checkAdmin, createProblem);
problemRouter.get("/get/:id", authMiddleware, getProblemById);
problemRouter.get("/get", authMiddleware, getProblems);
problemRouter.post("/update/:id", authMiddleware, checkAdmin, updateProblem);
problemRouter.delete("/delete/:id", authMiddleware, checkAdmin, deleteProblem);


export default problemRouter;

