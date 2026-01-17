/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import AppError from "../../errorHelpers/AppError";
// import { IsActive, IUser } from "../user/user.interface";
// import { User } from "../user/user.model";
// import httpStatus from "http-status-codes";
// import bcryptjs from "bcryptjs";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import { generateToken, verifyToken } from "../../utils/jwt";
// import { envVars } from "../../config/env";
// import {
//   createNewAccessAndRefreshToken,
//   createUserTokens,
// } from "../../utils/userTokens";
// import { de } from "zod/v4/locales/index.cjs";
// import { Driver } from "../driver/driver.model";
// import { IDriver } from "../driver/driver.interface";

// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   const isUserExists = await User.findOne({ email });
//   if (!isUserExists) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User not found");
//   }

//   const isPasswordMatch = await bcryptjs.compare(
//     password as string,
//     isUserExists.password as string
//   );

//   if (!isPasswordMatch) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password");
//   }

//   const userTokens = createUserTokens(isUserExists);

//   const { password: pass, ...rest } = isUserExists.toObject();
//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };

// const registerUser = async (payload: Partial<IUser>) => {
//   const { name, email, password, phone, address, role } = payload;

//   const isUserExists = await User.findOne({ email });
//   if (isUserExists) {
//     throw new AppError(
//       httpStatus.CONFLICT,
//       "A user with this email already exists."
//     );
//   }

//   const hashedPassword = await bcryptjs.hash(
//     password as string,
//     Number(envVars.BCRYPT_SALT_ROUND)
//   );

//   const userData = {
//     name,
//     email,
//     password: hashedPassword,
//     phone,
//     address,
//     role,
//   };

//   const newUser = await User.create(userData);

//   const userTokens = createUserTokens(newUser);

//   const { password: pass, ...rest } = newUser.toObject();

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };

// const getNewAccessToken = async (refreshToken: string) => {
//   const NewAccessToken = await createNewAccessAndRefreshToken(refreshToken);

//   return {
//     accessToken: NewAccessToken,
//   };
// };

// const resetPassword = async (
//   oldPassword: string,
//   newPassword: string,
//   decodedToken: JwtPayload
// ) => {
//   const user = await User.findById(decodedToken.userId);
//   const isOldPasswordMatch = await bcryptjs.compare(
//     oldPassword,
//     user?.password as string
//   );
//   if (!isOldPasswordMatch) {
//     throw new AppError(httpStatus.UNAUTHORIZED, "Old Password doesn't match");
//   }

//   user!.password = await bcryptjs.hash(
//     newPassword,
//     Number(envVars.BCRYPT_SALT_ROUND)
//   );
//   user?.save();
// };

// export const AuthServices = {
//   credentialsLogin,
//   getNewAccessToken,
//   resetPassword,
//   registerUser,
// };

/**
 * 
 * 





 */

//

/**
 *
 *
 *
 *
 */

// Assuming these types/classes exist in your project
interface IUser {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
  role?: string;
}
class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "AppError";
  }
}
const User = {
  // Mock Mongoose Model
  findOne: async (query: any) => ({
    toObject: () => ({ email: "test@example.com", password: "hashedpassword" }),
  }),
  create: async (data: any) => ({ toObject: () => data }),
};
const bcryptjs = {
  compare: async (p1: string, p2: string) => true,
  hash: async (p: string, salt: number) => "newhashedpassword",
};
const createUserTokens = (user: any) => ({
  accessToken: "new_access_token",
  refreshToken: "new_refresh_token",
});
const httpStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CONFLICT: 409,
  CREATED: 201,
};
// ---------------------------------------------------------------------------------------------------------------------

const credentialsLogin = async (payload: Partial<IUser> | undefined) => {
  // 🔑 FIX: Safe destructuring and input check
  const { email, password } = payload || {};

  if (!email || !password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Email and password are required for login."
    );
  }

  const isUserExists: any = await User.findOne({ email });
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  // NOTE: The mock bcrypt.compare returns true for demonstration
  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExists.toObject().password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  const userTokens = createUserTokens(isUserExists);

  const { password: pass, ...rest } = isUserExists.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest, // User data without the password hash
  };
};

const registerUser = async (payload: Partial<IUser> | undefined) => {
  // 🔑 FIX: Safe destructuring and input check
  const { name, email, password, phone, address, role } = payload || {};

  if (!name || !email || !password || !phone || !address || !role) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "All fields are required for registration."
    );
  }

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      "A user with this email already exists."
    );
  }

  // NOTE: The mock bcrypt.hash returns a string for demonstration
  const hashedPassword = await bcryptjs.hash(password as string, 10); // Using 10 as a mock salt round

  const userData = {
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    role,
  };

  const newUser: any = await User.create(userData);

  const userTokens = createUserTokens(newUser);

  const { password: pass, ...rest } = newUser.toObject();

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

// ... other service functions (getNewAccessToken, resetPassword) ...

export const AuthServices = {
  credentialsLogin,
  registerUser,
  // getNewAccessToken,
  // resetPassword,
};
