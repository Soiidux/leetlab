import express from "express";
import config from "./backendConfig.js";

import authRouter from "./routes/auth.routes.js";
import problemRouter from "./routes/problem.routes.js";
import executeRouter from "./routes/execute.routes.js";
import submissionRouter from "./routes/submission.routes.js";

import cookieParser from "cookie-parser";

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World");
});

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/problem", problemRouter);
app.use("/api/v1/execute", executeRouter);
app.use("/api/v1/submission", submissionRouter);

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
