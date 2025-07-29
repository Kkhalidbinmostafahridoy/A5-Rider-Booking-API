import express, { Request, Response } from "express";

const app = express();

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to A5-Ride-Booking-System-API",
  });
});

export default app;
