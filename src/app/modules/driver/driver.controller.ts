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

const acceptOrRejectRide = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rideId } = req.params;
    const { action } = req.body; // expect "accept" or "reject"
    if (!["accept", "reject"].includes(action)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ success: false, message: "Invalid action" });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ success: false, message: "Ride not found" });
    }

    if (ride.status !== "pending") {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "Only pending rides can be accepted or rejected",
      });
    }

    ride.status = action === "accept" ? "accepted" : "rejected";
    ride.driver = req.user?.userId; // assign driver who accepted/rejected
    await ride.save();

    res.status(httpStatus.OK).json({
      success: true,
      message: `Ride ${action}ed successfully`,
      data: ride,
    });
  } catch (err) {
    next(err);
  }
};

export const getDriverController = {
  registerDriver,
  acceptOrRejectRide,
};
