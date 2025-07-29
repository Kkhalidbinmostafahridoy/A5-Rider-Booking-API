/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("connected to DB !!");
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening port ${envVars.PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};
startServer();

process.on("unCaught Exception", (err) => {
  console.log("unCaught Exception detection......server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGTERM", (err) => {
  console.log("SIGTERM signal received......server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received......server shutting down");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("unCaught Exception", (err) => {
  console.log("unCaught Exception detection......server shutting down", err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// throw new Error("I forgot to handle local error");
