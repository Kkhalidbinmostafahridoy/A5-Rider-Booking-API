"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRideStatusSchema = exports.requestRideSchema = void 0;
const zod_1 = require("zod");
const rider_interface_1 = require("./rider.interface");
const geoPointSchema = zod_1.z.object({
    coordinates: zod_1.z
        .tuple([zod_1.z.number(), zod_1.z.number()]) // [longitude, latitude]
        .refine(([lng, lat]) => lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90, {
        message: "Invalid longitude or latitude",
    }),
    address: zod_1.z.string().min(1, "Address is required"),
});
exports.requestRideSchema = zod_1.z.object({
    pickupLocation: geoPointSchema,
    destinationLocation: geoPointSchema,
});
exports.updateRideStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        rider_interface_1.RideStatus.PickedUp,
        rider_interface_1.RideStatus.InTransit,
        rider_interface_1.RideStatus.Completed,
    ]),
});
