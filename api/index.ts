/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import app from "../src/app";
import { envVars } from "../src/app/config/env";

// MongoDB connection cache for serverless
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(envVars.DB_URL).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected successfully");
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  // Connect to database (will reuse connection if already connected)
  await connectDatabase();

  // Handle the request with Express app
  app(req, res);
}
