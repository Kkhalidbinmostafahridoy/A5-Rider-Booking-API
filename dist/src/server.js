"use strict";
// /* eslint-disable no-console */
// import { Server } from "http";
// import mongoose from "mongoose";
// import app from "./app";
// import { envVars } from "./app/config/env";
// import { seedAdmin } from "./app/utils/seedAdmin";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
// let server: Server;
// const startServer = async () => {
//   try {
//     await mongoose.connect(envVars.DB_URL);
//     console.log("connected to DB !!");
//     server = app.listen(envVars.PORT, () => {
//       console.log(`Server is listening port ${envVars.PORT}`);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };
// (async () => {
//   await startServer();
//   await seedAdmin();
// })();
// process.on("unCaught Exception", (err) => {
//   console.log("unCaught Exception detection......server shutting down", err);
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });
// process.on("SIGTERM", (err) => {
//   console.log("SIGTERM signal received......server shutting down", err);
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });
// process.on("SIGINT", () => {
//   console.log("SIGINT signal received......server shutting down");
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });
// process.on("unCaught Exception", (err) => {
//   console.log("unCaught Exception detection......server shutting down", err);
//   if (server) {
//     server.close(() => {
//       process.exit(1);
//     });
//   }
//   process.exit(1);
// });
// // throw new Error("I forgot to handle local error");
/* eslint-disable @typescript-eslint/no-explicit-any */
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./app/config/env");
// MongoDB singleton connection for serverless
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
async function connectDB() {
    if (cached.conn)
        return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose_1.default.connect(env_1.envVars.DB_URL).then((m) => m.connection);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
// Export Vercel handler
async function handler(req, res) {
    await connectDB(); // ensure DB is connected
    (0, app_1.default)(req, res); // Express app handles the request
}
