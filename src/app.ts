/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from "express";
import { UserRoutes } from "./app/modules/user/user.route";
import cors from "cors";
import { router } from "./app/routes";
import { AnyARecord } from "dns";
import { any, success } from "zod";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors());

app.use("/api", router);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to A5-Ride-Booking-System-API",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
