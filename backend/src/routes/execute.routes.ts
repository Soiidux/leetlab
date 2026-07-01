import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { executeCode } from "../controllers/execute.controllers.js";

const executeRouter = Router();

executeRouter.post("/", authMiddleware, executeCode);

export default executeRouter;