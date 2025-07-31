import { z } from "zod";
import { RideStatus } from "./rider.interface";

const geoPointSchema = z.object({
  coordinates: z
    .tuple([z.number(), z.number()]) // [longitude, latitude]
    .refine(
      ([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90,
      {
        message: "Invalid longitude or latitude",
      }
    ),
  address: z.string().min(1, "Address is required"),
});

export const requestRideSchema = z.object({
  pickupLocation: geoPointSchema,
  destinationLocation: geoPointSchema,
});

export const updateRideStatusSchema = z.object({
  status: z.enum([
    RideStatus.PickedUp,
    RideStatus.InTransit,
    RideStatus.Completed,
  ]),
});
