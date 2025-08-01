/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { Driver } from "./driver.model";
import { envVars } from "../../config/env";
import { createUserTokens } from "../../utils/userTokens";
import { Role } from "../user/user.interface";
import { sendResponse } from "../../utils/sendResponse";
import { Ride } from "../rider/rider.model";
import { Types } from "mongoose";

const registerDriver = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, phone, address, licenseNumber, vehicleInfo } =
    req.body;

  const existingDriverWithLicense = await Driver.findOne({ licenseNumber });
  if (existingDriverWithLicense) {
    throw new AppError(
      httpStatus.CONFLICT,
      `A driver with license number ${licenseNumber} already exists.`
    );
  }
  if (!password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  }
  if (!licenseNumber) {
    throw new AppError(httpStatus.BAD_REQUEST, "License number is required");
  }
  if (
    !vehicleInfo ||
    !vehicleInfo.make ||
    !vehicleInfo.model ||
    !vehicleInfo.plateNumber
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Complete vehicle info is required"
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A user with this email already exists"
    );
  }

  const hashedPassword = await bcryptjs.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND) || 10
  );

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    role: Role.Driver,
  });

  const newDriver = await Driver.create({
    name,
    email,
    phone,
    address,
    licenseNumber,
    vehicleInfo,
    availability: "offline",
    earnings: 0,
    userId: newUser._id,
  });

  const tokens = createUserTokens(newUser);

  const { password: pwd, ...userWithoutPassword } = newUser.toObject();

  sendResponse(res, {
    success: true,
    message: "driver Created Successfully",
    statusCode: httpStatus.CREATED,
    data: {
      user: userWithoutPassword,
      driver: newDriver,
      tokens,
    },
  });
});

const acceptOrRejectRide = catchAsync(async (req: Request, res: Response) => {
  const { rideId } = req.params;
  const action = req.body.action as "accept" | "reject";
  const driverId = req.user?.userId;

  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new AppError(404, "Ride not found");
  }

  if (!["pending", "requested"].includes(ride.status)) {
    throw new AppError(
      400,
      "Only pending or requested rides can be accepted or rejected"
    );
  }

  const verbMap: Record<"accept" | "reject", string> = {
    accept: "accepted",
    reject: "rejected",
  };

  if (action === "accept") {
    ride.status = "accepted";
    ride.driverId = driverId;
    ride.statusTimestamps = ride.statusTimestamps || {};
    ride.statusTimestamps.acceptedAt = new Date();
  } else if (action === "reject") {
    ride.status = "rejected";
    ride.statusTimestamps = ride.statusTimestamps || {};
    ride.statusTimestamps.rejectedAt = new Date();
  } else {
    throw new AppError(400, "Invalid action. Use 'accept' or 'reject'.");
  }

  await ride.save();

  sendResponse(res, {
    success: true,
    message: `Ride ${verbMap[action]} successfully`,
    statusCode: httpStatus.OK,
    data: ride,
  });
});

const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  const { rideId } = req.params;
  const { newStatus } = req.body;
  const driverId = req.user?.userId?.toString();

  const allowedStatuses = ["picked_up", "in_transit", "completed"];
  if (!allowedStatuses.includes(newStatus)) {
    throw new AppError(
      400,
      `Invalid status. Allowed: ${allowedStatuses.join(", ")}`
    );
  }

  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw new AppError(404, "Ride not found");
  }

  if (!ride.driverId || ride.driverId.toString() !== driverId) {
    throw new AppError(403, "You are not authorized to update this ride");
  }

  const currentStatus = ride.status;
  const validTransitions: Record<string, string[]> = {
    accepted: ["picked_up"],
    picked_up: ["in_transit"],
    in_transit: ["completed"],
  };

  if (
    currentStatus !== newStatus &&
    (!validTransitions[currentStatus] ||
      !validTransitions[currentStatus].includes(newStatus))
  ) {
    throw new AppError(
      400,
      `Invalid status transition from '${currentStatus}' to '${newStatus}'`
    );
  }

  ride.status = newStatus;
  ride.statusTimestamps = ride.statusTimestamps || {};

  if (newStatus === "picked_up") {
    ride.statusTimestamps.pickedUpAt = new Date();
  } else if (newStatus === "in_transit") {
    ride.statusTimestamps.inTransitAt = new Date();
  } else if (newStatus === "completed") {
    ride.statusTimestamps.completedAt = new Date();
  }

  await ride.save();

  res.status(httpStatus.OK).json({
    success: true,
    message: `Ride status updated to '${newStatus}' successfully`,
    data: ride,
  });
});

const getEarningsHistory = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user?.userId?.toString();

  const completedRides = await Ride.find({
    driverId,
    status: "completed",
  }).select("fare pickupLocation dropoffLocation completedAt");

  const totalEarnings = completedRides.reduce(
    (sum, ride) => sum + (ride.fare || 0),
    0
  );

  res.status(200).json({
    success: true,
    message: "Earnings history retrieved successfully",
    data: {
      totalEarnings,
      rides: completedRides,
    },
  });
});

const setAvailabilityStatus = catchAsync(
  async (req: Request, res: Response) => {
    const driverId = req.user?.userId?.toString();
    const { availability } = req.body;

    if (!["online", "offline"].includes(availability)) {
      throw new AppError(
        400,
        "Invalid availability status. Allowed: online, offline"
      );
    }

    if (!driverId) {
      throw new AppError(401, "Unauthorized: No user ID found");
    }

    console.log("Driver ID from token/user:", driverId);

    let driver;

    try {
      driver = await Driver.findOne({ userId: new Types.ObjectId(driverId) });
    } catch (err) {
      console.log("Invalid ObjectId or mismatch, trying as string...");
    }

    if (!driver) {
      driver = await Driver.findOne({ userId: driverId });
    }

    if (!driver) {
      throw new AppError(404, "Driver not found");
    }

    driver.availability = availability;
    await driver.save();

    res.status(200).json({
      success: true,
      message: `Driver availability set to '${availability}'`,
      data: driver,
    });
  }
);

export const getDriverController = {
  registerDriver,
  acceptOrRejectRide,
  updateRideStatus,
  getEarningsHistory,
  setAvailabilityStatus,
};
