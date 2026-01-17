"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.riderController = exports.getRideHistory = exports.cancelRide = exports.requestRide = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const rider_model_1 = require("./rider.model");
const rider_interface_1 = require("./rider.interface");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const requestRide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const riderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!riderId) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Rider ID missing");
        }
        const { pickupLocation, destinationLocation } = req.body;
        const activeRide = yield rider_model_1.Ride.findOne({
            riderId,
            // for build error
            // status: {
            //   $in: [
            //     RideStatus.Requested,
            //     RideStatus.Accepted,
            //     RideStatus.PickedUp,
            //     RideStatus.InTransit,
            //   ],
            // },
            status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
        });
        if (activeRide) {
            throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "You already have an active ride.");
        }
        const newRide = {
            riderId,
            pickupLocation,
            destinationLocation,
            status: rider_interface_1.RideStatus.Requested,
            statusTimestamps: { requestedAt: new Date() },
        };
        const result = yield rider_model_1.Ride.create(newRide);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            message: "Ride requested successfully",
            statusCode: http_status_codes_1.default.CREATED,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.requestRide = requestRide;
const cancelRide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { rideId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        console.log("Cancelling ride with ID:", rideId);
        if (!rideId || !rideId.match(/^[0-9a-fA-F]{24}$/)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid ride ID format");
        }
        const ride = yield rider_model_1.Ride.findById(rideId);
        if (!ride) {
            console.error("Ride not found for ID:", rideId);
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
        }
        if (!userId || ride.riderId.toString() !== userId) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You can only cancel your own ride");
        }
        if (!["requested", "accepted"].includes(ride.status.toLowerCase())) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You can only cancel a ride before it starts");
        }
        const now = new Date();
        const createdAt = ride.createdAt || now;
        const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
        if (diffMinutes > 10) {
            throw new AppError_1.default(400, "Cancel window expired (10 mins)");
        }
        ride.status = rider_interface_1.RideStatus.Cancelled;
        ride.statusTimestamps.cancelledAt = new Date();
        yield ride.save();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            message: "Ride cancelled successfully",
            data: ride,
            statusCode: http_status_codes_1.default.OK,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.cancelRide = cancelRide;
// export const getRideHistory = catchAsync(
//   async (req: Request, res: Response) => {
//     const riderId = req.user?.userId;
//     if (!riderId) {
//       throw new AppError(401, "Rider ID missing");
//     }
//     console.log("Fetching ride history for rider ID:", riderId);
//     const rides = await Ride.find({ riderId }).sort({ createdAt: -1 });
//     const totalRequested = rides.filter(
//       (ride) => ride.status === "requested"
//     ).length;
//     const totalCancelled = rides.filter(
//       (ride) => ride.status === "cancelled"
//     ).length;
//     const responseData = {
//       rides,
//       summary: {
//         totalRequested,
//         totalCancelled,
//         totalRides: rides.length,
//       },
//     };
//     sendResponse(res, {
//       success: true,
//       message: "Ride history fetched successfully",
//       statusCode: httpStatus.OK,
//       data: responseData,
//     });
//   }
// );
exports.getRideHistory = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const riderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!riderId) {
        throw new AppError_1.default(401, "Rider ID missing");
    }
    console.log("Fetching ride history for rider ID:", riderId);
    // fetch all rides for this rider
    const rides = yield rider_model_1.Ride.find({ riderId }).sort({ createdAt: -1 });
    // classify
    const requestedRides = rides.filter((ride) => ride.status === "requested");
    const cancelledRides = rides.filter((ride) => ride.status === "cancelled");
    const otherRides = rides.filter((ride) => ride.status !== "requested" && ride.status !== "cancelled");
    const responseData = {
        summary: {
            totalRequested: requestedRides.length,
            totalCancelled: cancelledRides.length,
            totalRides: rides.length,
        },
        details: {
            requested: requestedRides,
            cancelled: cancelledRides,
            others: otherRides,
        },
    };
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "Ride history fetched successfully",
        statusCode: http_status_codes_1.default.OK,
        data: responseData,
    });
}));
exports.riderController = {
    requestRide: exports.requestRide,
    cancelRide: exports.cancelRide,
    getRideHistory: exports.getRideHistory,
};
