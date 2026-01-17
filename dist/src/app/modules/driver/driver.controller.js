"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDriverController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const driver_model_1 = require("./driver.model");
const env_1 = require("../../config/env");
const userTokens_1 = require("../../utils/userTokens");
const user_interface_1 = require("../user/user.interface");
const sendResponse_1 = require("../../utils/sendResponse");
const rider_model_1 = require("../rider/rider.model");
const mongoose_1 = require("mongoose");
const rider_interface_1 = require("../rider/rider.interface");
const registerDriver = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, email, password, phone, address, licenseNumber, vehicleInfo } = req.body;
    const existingDriverWithLicense = await driver_model_1.Driver.findOne({ licenseNumber });
    if (existingDriverWithLicense) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, `A driver with license number ${licenseNumber} already exists.`);
    }
    if (!password) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Password is required");
    }
    if (!licenseNumber) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "License number is required");
    }
    if (!vehicleInfo ||
        !vehicleInfo.make ||
        !vehicleInfo.model ||
        !vehicleInfo.plateNumber) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Complete vehicle info is required");
    }
    const existingUser = await user_model_1.User.findOne({ email });
    if (existingUser) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A user with this email already exists");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND) || 10);
    const newUser = await user_model_1.User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role: user_interface_1.Role.Driver,
    });
    const newDriver = await driver_model_1.Driver.create({
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
    const tokens = (0, userTokens_1.createUserTokens)(newUser);
    const { password: pwd, ...userWithoutPassword } = newUser.toObject();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "driver Created Successfully",
        statusCode: http_status_codes_1.default.CREATED,
        data: {
            user: userWithoutPassword,
            driver: newDriver,
            tokens,
        },
    });
});
const acceptOrRejectRide = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { rideId } = req.params;
    const action = req.body.action;
    const driverId = req.user?.userId;
    const ride = await rider_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(404, "Ride not found");
    }
    if (!["pending", "requested"].includes(ride.status)) {
        throw new AppError_1.default(400, "Only pending or requested rides can be accepted or rejected");
    }
    const verbMap = {
        accept: "accepted",
        reject: "rejected",
    };
    if (action === "accept") {
        ride.status = rider_interface_1.RideStatus.Accepted;
        // ride.driverId = driverId; //for error build
        ride.driverId = new mongoose_1.Types.ObjectId(driverId);
        ride.statusTimestamps = ride.statusTimestamps || {};
        ride.statusTimestamps.acceptedAt = new Date();
    }
    else if (action === "reject") {
        ride.status = rider_interface_1.RideStatus.Rejected;
        ride.statusTimestamps = ride.statusTimestamps || {};
        ride.statusTimestamps.rejectedAt = new Date();
    }
    else {
        throw new AppError_1.default(400, "Invalid action. Use 'accept' or 'reject'.");
    }
    await ride.save();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: `Ride ${verbMap[action]} successfully`,
        statusCode: http_status_codes_1.default.OK,
        data: ride,
    });
});
const updateRideStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { rideId } = req.params;
    const { newStatus } = req.body;
    const driverId = req.user?.userId?.toString();
    const allowedStatuses = ["picked_up", "in_transit", "completed"];
    if (!allowedStatuses.includes(newStatus)) {
        throw new AppError_1.default(400, `Invalid status. Allowed: ${allowedStatuses.join(", ")}`);
    }
    const ride = await rider_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(404, "Ride not found");
    }
    if (!ride.driverId || ride.driverId.toString() !== driverId) {
        throw new AppError_1.default(403, "You are not authorized to update this ride");
    }
    const currentStatus = ride.status;
    const validTransitions = {
        accepted: ["picked_up"],
        picked_up: ["in_transit"],
        in_transit: ["completed"],
    };
    if (currentStatus !== newStatus &&
        (!validTransitions[currentStatus] ||
            !validTransitions[currentStatus].includes(newStatus))) {
        throw new AppError_1.default(400, `Invalid status transition from '${currentStatus}' to '${newStatus}'`);
    }
    ride.status = newStatus;
    ride.statusTimestamps = ride.statusTimestamps || {};
    if (newStatus === "picked_up") {
        ride.statusTimestamps.pickedUpAt = new Date();
    }
    else if (newStatus === "in_transit") {
        ride.statusTimestamps.inTransitAt = new Date();
    }
    else if (newStatus === "completed") {
        ride.statusTimestamps.completedAt = new Date();
    }
    await ride.save();
    res.status(http_status_codes_1.default.OK).json({
        success: true,
        message: `Ride status updated to '${newStatus}' successfully`,
        data: ride,
    });
});
const getEarningsHistory = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const driverId = req.user?.userId?.toString();
    const completedRides = await rider_model_1.Ride.find({
        driverId,
        status: "completed",
    }).select("fare pickupLocation dropoffLocation completedAt");
    const totalEarnings = completedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
    res.status(200).json({
        success: true,
        message: "Earnings history retrieved successfully",
        data: {
            totalEarnings,
            rides: completedRides,
        },
    });
});
const setAvailabilityStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const driverId = req.user?.userId?.toString();
    const { availability } = req.body;
    if (!["online", "offline"].includes(availability)) {
        throw new AppError_1.default(400, "Invalid availability status. Allowed: online, offline");
    }
    if (!driverId) {
        throw new AppError_1.default(401, "Unauthorized: No user ID found");
    }
    console.log("Driver ID from token/user:", driverId);
    let driver;
    try {
        driver = await driver_model_1.Driver.findOne({ userId: new mongoose_1.Types.ObjectId(driverId) });
    }
    catch (err) {
        console.log("Invalid ObjectId or mismatch, trying as string...");
    }
    if (!driver) {
        driver = await driver_model_1.Driver.findOne({ userId: driverId });
    }
    if (!driver) {
        throw new AppError_1.default(404, "Driver not found");
    }
    driver.availability = availability;
    await driver.save();
    res.status(200).json({
        success: true,
        message: `Driver availability set to '${availability}'`,
        data: driver,
    });
});
exports.getDriverController = {
    registerDriver,
    acceptOrRejectRide,
    updateRideStatus,
    getEarningsHistory,
    setAvailabilityStatus,
};
