/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Ride } from "./rider.model";
import { IRide, RideStatus } from "./rider.interface";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const requestRide = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const riderId = (req as any).user?.userId; //user error line vercel thats why user req as any

    if (!riderId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Rider ID missing");
    }

    const { pickupLocation, destinationLocation } = req.body;

    const activeRide = await Ride.findOne({
      riderId,
      status: {
        $in: [
          RideStatus.Requested,
          RideStatus.Accepted,
          RideStatus.PickedUp,
          RideStatus.InTransit,
        ],
      },
    });

    if (activeRide) {
      throw new AppError(
        httpStatus.CONFLICT,
        "You already have an active ride."
      );
    }

    const newRide: IRide = {
      riderId,
      pickupLocation,
      destinationLocation,
      status: RideStatus.Requested,
      statusTimestamps: { requestedAt: new Date() },
    } as unknown as IRide;

    const result = await Ride.create(newRide);

    sendResponse(res, {
      success: true,
      message: "Ride requested successfully",
      statusCode: httpStatus.CREATED,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelRide = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rideId } = req.params;
    const userId = (req as any).user?.userId; //user error line vercel thats why user req as any

    console.log("Cancelling ride with ID:", rideId);

    if (!rideId || !rideId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid ride ID format");
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      console.error("Ride not found for ID:", rideId);
      throw new AppError(httpStatus.NOT_FOUND, "Ride not found");
    }

    if (!userId || ride.riderId.toString() !== userId) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You can only cancel your own ride"
      );
    }

    if (!["requested", "accepted"].includes(ride.status.toLowerCase())) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You can only cancel a ride before it starts"
      );
    }

    const now = new Date();
    const createdAt = (ride as any).createdAt || now; //rider error line vercel thats why use rider as any
    const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
    if (diffMinutes > 10) {
      throw new AppError(400, "Cancel window expired (10 mins)");
    }

    (ride as any).status = "cancelled"; //rider error line vercel thats why use rider as any
    ride.statusTimestamps.cancelledAt = new Date();

    await ride.save();

    sendResponse(res, {
      success: true,
      message: "Ride cancelled successfully",
      data: ride,
      statusCode: httpStatus.OK,
    });
  } catch (error) {
    next(error);
  }
};

export const getRideHistory = catchAsync(
  async (req: Request, res: Response) => {
    const riderId = (req as any).user?.userId; //user error line vercel thats why user req as any

    if (!riderId) {
      throw new AppError(401, "Rider ID missing");
    }

    console.log("Fetching ride history for rider ID:", riderId);

    const rides = await Ride.find({ riderId }).sort({ createdAt: -1 });

    const totalRequested = rides.filter(
      (ride) => ride.status === "requested"
    ).length;
    const totalCancelled = rides.filter(
      (ride) => ride.status === "cancelled"
    ).length;

    const responseData = {
      rides,
      summary: {
        totalRequested,
        totalCancelled,
        totalRides: rides.length,
      },
    };

    sendResponse(res, {
      success: true,
      message: "Ride history fetched successfully",
      statusCode: httpStatus.OK,
      data: responseData,
    });
  }
);

export const riderController = {
  requestRide,
  cancelRide,
  getRideHistory,
};
