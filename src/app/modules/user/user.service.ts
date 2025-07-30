// import tr from "zod/v4/locales/tr.cjs";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already Exists");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };
  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });
  return user;
};

const getAllUsers = async () => {
  const users = await User.find({});
  const totalUsers = await User.countDocuments();
  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const ifUserExists = await User.findById(userId);
  if (!ifUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not Found");
  }

  const restrictedRoles = [Role.User, Role.Rider, Role.Driver];

  // Fields only Admin can update
  const restrictedFields = ["role", "isActive", "isDeleted", "isVerified"];

  if (restrictedRoles.includes(decodedToken.role)) {
    const attemptedRestrictedUpdate = restrictedFields.some((field) =>
      Object.prototype.hasOwnProperty.call(payload, field)
    );

    if (attemptedRestrictedUpdate) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not authorized to Update this user information"
      );
    }
  }

  // Handle password update with hashing
  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
  }

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
};

const checkIfUserBlocked = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return user.isActive;
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndDelete(id);

  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  checkIfUserBlocked,
};
