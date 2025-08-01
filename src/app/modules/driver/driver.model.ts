import { Schema, model } from "mongoose";
import { IDriver } from "./driver.interface";

const driverSchema = new Schema<IDriver>(
  {
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
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Driver = model<IDriver>("Driver", driverSchema);
