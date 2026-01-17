"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const rider_interface_1 = require("../rider/rider.interface");
const rideSchema = new mongoose_1.Schema({
    riderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
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
        enum: Object.values(rider_interface_1.RideStatus),
        default: rider_interface_1.RideStatus.Requested,
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
}, {
    timestamps: true,
});
exports.Ride = (0, mongoose_1.model)("Ride", rideSchema);
