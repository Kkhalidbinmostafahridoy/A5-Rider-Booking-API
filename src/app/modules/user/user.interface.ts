import { Types, Document } from "mongoose";

export interface IAuthProvider {
  provider: string;
  providerId: string;
}

export enum Role {
  Admin = "ADMIN",
  User = "USER",
  Rider = "RIDER",
  Driver = "DRIVER",
}

export enum IsActive {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Blocked = "BLOCKED",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: string;
  role: Role;
  auths: IAuthProvider[];
  rider?: Types.ObjectId | null;
  driver?: Types.ObjectId | null;

  comparePassword?(candidatePassword: string): Promise<string>;
}
