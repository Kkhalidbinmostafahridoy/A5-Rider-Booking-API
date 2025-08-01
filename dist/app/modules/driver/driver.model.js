"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driverSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    vehicleInfo: {
        make: { type: String, required: true },
        model: { type: String, required: true },
        plateNumber: { type: String, required: true, unique: true },
    },
    availability: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
    },
    earnings: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
}, {
    timestamps: true,
});
exports.Driver = (0, mongoose_1.model)("Driver", driverSchema);
