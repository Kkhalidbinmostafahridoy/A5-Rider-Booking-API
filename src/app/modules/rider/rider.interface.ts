import { Types } from "mongoose";

export interface IAuthProvider {
  provider: "credentials" | "google" | "facebook"; // add more if needed
  providerId: string;
}

export enum RideStatus {
  Requested = "requested",
  Accepted = "accepted",
  PickedUp = "picked_up",
  InTransit = "in_transit",
  Completed = "completed",
  Cancelled = "cancelled",
  status = "status",
  driverId = "driverId",
  statusTimestamps = "statusTimestamps",
}

export interface IRide {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  location?: string;
  slug?: string;
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId;
  pickupLocation: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
  destinationLocation: {
    type: string;
    coordinates: [number, number];
    address: string;
  };
  status: RideStatus;
  statusTimestamps: {
    requestedAt: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    inTransitAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };
  fare?: number;
}
