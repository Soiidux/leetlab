import express from "express";
import config from "./backendConfig.js";
import authRoutes from "./routes/auth.routes.js";
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
app.use("/api/v1/auth", authRoutes);
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
