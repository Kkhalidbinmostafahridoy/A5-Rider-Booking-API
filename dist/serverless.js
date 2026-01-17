"use strict";
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import app from "./src/app";
// import mongoose from "mongoose";
// import { envVars } from "./src/app/config/env";
// // MongoDB singleton connection for serverless
// let cached: any = (global as any).mongoose;
// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }
// async function connectDB() {
//   if (cached.conn) return cached.conn;
//   if (!cached.promise) {
//     cached.promise = mongoose.connect(envVars.DB_URL).then((m) => m.connection);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }
// // Export Vercel handler
// export default async function handler(req: any, res: any) {
//   await connectDB(); // ensure DB is connected
//   app(req, res); // Express app handles the request
// }
