import { Types } from "mongoose";

export type DriverStatus = "online" | "offline";

export interface IDriver {
  _id?: Types.ObjectId;
  name: string;
  phone: string;
  password: string;
  email: string;
  address: string;
  licenseNumber: string;
  vehicleInfo: {
    make: string;
    model: string;
    plateNumber: string;
  };
  availability: DriverStatus;
  earnings: number;
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
