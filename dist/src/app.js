"use strict";
// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // /* eslint-disable @typescript-eslint/no-unused-vars */
// // import express, { NextFunction, Request, Response } from "express";
// // import { UserRoutes } from "./app/modules/user/user.route";
// // import cors from "cors";
// // import { router } from "./app/routes";
// // import { AnyARecord } from "dns";
// // import { any, success } from "zod";
// // import { envVars } from "./app/config/env";
// // import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
// // import { notFound } from "./app/middlewares/notFound";
// // import cookieParser from "cookie-parser";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// // const app = express();
// // app.use(express.json());
// // app.use(cookieParser());
// // // ✅ define allowed origins from env
// // const corsOptions = {
// //   origin: envVars.FRONTEND_URL, // must match frontend exactly
// //   credentials: true,
// //   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // allow all methods
// //   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // allow headers you use
// // };
// // app.use("/api", router);
// // app.get("/", async (req: Request, res: Response) => {
// //   res.status(200).json({
// //     message: "Welcome to A5-Ride-Booking-System-API",
// //   });
// // });
// // app.use(globalErrorHandler);
// // app.use(notFound);
// // export default app;
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import express, { Request, Response, NextFunction } from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import { envVars } from "./app/config/env";
// import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
// import { notFound } from "./app/middlewares/notFound";
// import { AuthRoutes } from "./app/modules/auth/auth.route";
// import { UserRoutes } from "./app/modules/user/user.route";
// const app = express();
// // Parse JSON and cookies
// app.use(express.json());
// app.use(cookieParser());
// // ✅ CORS setup for credentials
// const corsOptions = {
//   origin: envVars.FRONTEND_URL, // must exactly match frontend URL
//   credentials: true, // allow cookies
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
// };
// console.log("FRONTEND_URL", envVars.FRONTEND_URL);
// // Apply CORS middleware globally BEFORE all routes
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
// // ------------------- Routes -------------------
// // Health check
// app.get("/", (req: Request, res: Response) => {
//   res.status(200).json({
//     message: "Welcome to A5-Ride-Booking-System-API",
//   });
// });
// // Auth routes
// app.use("/auth", AuthRoutes);
// // User routes (optional)
// app.use("/user", UserRoutes);
// // ------------------- Error Handling -------------------
// app.use(globalErrorHandler);
// app.use(notFound);
// export default app;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("../src/app/config/env");
const globalErrorHandler_1 = require("../src/app/middlewares/globalErrorHandler");
const notFound_1 = require("../src/app/middlewares/notFound");
const auth_route_1 = require("../src/app/modules/auth/auth.route");
const user_route_1 = require("../src/app/modules/user/user.route");
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// CORS for credentials
const allowedOrigins = ["http://localhost:3000", env_1.envVars.FRONTEND_URL];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin))
            return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
// Routes
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to A5-Ride-Booking-System-API" });
});
app.use("/auth", auth_route_1.AuthRoutes);
app.use("/user", user_route_1.UserRoutes);
// Error handlers
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
