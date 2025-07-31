import { Schema, model } from "mongoose";
import { IRide, RideStatus } from "../rider/rider.interface";

const rideSchema = new Schema<IRide>({
  riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  driverId: { type: Schema.Types.ObjectId, ref: "User" },
  pickupLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    address: { type: String, required: true },
  },
  destinationLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: { type: String, required: true },
  },
  status: {
    type: String,
    enum: Object.values(RideStatus),
    default: RideStatus.Requested,
  },
  statusTimestamps: {
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: Date,
    pickedUpAt: Date,
    inTransitAt: Date,
    completedAt: Date,
    cancelledAt: Date,
  },
  fare: Number,
});

export const Ride = model<IRide>("Ride", rideSchema);
