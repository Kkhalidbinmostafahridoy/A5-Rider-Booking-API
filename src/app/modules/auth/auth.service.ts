/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createUserTokens } from "../../utils/userTokens";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExists = await User.findOne({ email });
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User not found");
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExists.password as string
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  const userTokens = createUserTokens(isUserExists);

  const { password: pass, ...rest } = isUserExists.toObject();
  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: rest,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExists = await User.findOne({
    email: verifiedRefreshToken.email,
  });

  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "user does not exists");
  }
  if (
    isUserExists.isActive === IsActive.Blocked ||
    isUserExists.isActive === IsActive.Inactive
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `user is ${isUserExists.isActive}`
    );
  }
  if (isUserExists.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "user is deleted");
  }

  const jwtPayload = {
    userId: isUserExists._id,
    email: isUserExists.email,
    role: isUserExists.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken,
};
