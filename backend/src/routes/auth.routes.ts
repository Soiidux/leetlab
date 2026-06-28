import { Router } from "express";
import { register, login, logout, check } from "../controllers/auth.controllers.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/check", check);

export default authRouter;