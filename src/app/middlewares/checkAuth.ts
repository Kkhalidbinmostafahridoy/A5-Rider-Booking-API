/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";
import httpStatus from "http-status-codes";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(httpStatus.BAD_REQUEST, "No token received");
      }

      const decoded = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as {
        userId: string;
        email: string;
        role: string;
        iat?: number;
        exp?: number;
      };

      if (!decoded.userId) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token: no userId");
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      if (user.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
      }

      if (
        user.isActive === IsActive.Blocked ||
        user.isActive === IsActive.Inactive
      ) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${user.isActive}`);
      }

      if (!authRoles.includes(decoded.role)) {
        console.log("Decoded role from token:", decoded.role);
        console.log("Authorized roles:", authRoles);
        throw new AppError(
          httpStatus.FORBIDDEN,
          "You are not authorized to access this route"
        );
      }

      (req as any).user = {
        //user error line vercel thats why user req as any
        userId: decoded.userId,
        role: decoded.role,
        email: decoded.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
