import express from "express";
import type { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes.js";
import { errorHandler } from "./common/middlewares/errorHandler.js";
import { ApiError } from "./common/utils/apiError.js";
import pollRouter from "./modules/poll/poll.routes.js";
export function createExpressServer(): Express {
  const app = express();

  
  app.use(cors({
  origin: 'https://pollzy.manassaha425.workers.dev',
  credentials: true,               
}))
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); 

  
  app.use("/api/v1/user", authRouter);
  app.use("/api/v1/poll", pollRouter);


  app.get("/health", (_req, res) => {
    res.json({ success: true, message: "Server is running" });
  });

  
  app.use((_req, _res, next) => {
    next(ApiError.notFound("Route not found"));
  });

  
  app.use(errorHandler);

  return app;
}
