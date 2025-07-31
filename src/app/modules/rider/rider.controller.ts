import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Ride } from "./rider.model";
import { IRide, RideStatus } from "./rider.interface";

export const requestRide = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const riderId = req.user?._id; // ✅ This should now work

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

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Ride requested successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// ✅ Cancel a ride
const cancelRide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rideId } = req.params;
    const riderId = req.user?._id;

    const ride = await Ride.findById(rideId);
    if (!ride) throw new AppError(httpStatus.NOT_FOUND, "Ride not found");

    if (ride.riderId.toString() !== riderId) {
      throw new AppError(httpStatus.FORBIDDEN, "Not your ride");
    }

    if (ride.status !== RideStatus.Requested) {
      throw new AppError(httpStatus.BAD_REQUEST, `Ride already ${ride.status}`);
    }

    ride.status = RideStatus.Cancelled;
    ride.statusTimestamps.cancelledAt = new Date();
    await ride.save();

    res.status(httpStatus.OK).json({
      success: true,
      message: "Ride cancelled successfully",
      data: ride,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ View ride history
const getRideHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const riderId = req.user?._id;

    const history = await Ride.find({ riderId }).sort({
      "statusTimestamps.requestedAt": -1,
    });

    res.status(httpStatus.OK).json({
      success: true,
      message: "Ride history retrieved",
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

export const riderController = {
  requestRide,
  cancelRide,
  getRideHistory,
};
