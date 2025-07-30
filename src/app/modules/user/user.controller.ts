/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { success } from "zod";
import tr from "zod/v4/locales/tr.cjs";
import { id } from "zod/v4/locales/index.cjs";
import { sendResponse } from "../../utils/sendResponse";
import { User } from "./user.model";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All users retrieved successfully",
      data: users.data,
      meta: users.meta,
    });
  }
);

const updatedUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const token = req.headers.authorization;
    const VerifiedToken = verifyToken(
      token as string,
      envVars.JWT_ACCESS_SECRET
    ) as JwtPayload;
    const payload = req.body;
    const user = await UserServices.updateUser(id, payload, VerifiedToken);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User updated successfully",
      data: user,
    });
  }
);

const checkBlockedStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return sendResponse(res, {
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: "User not found",
        data: null,
      });
    }

    const isActive = user.isActive;
    const isBlocked = isActive === "BLOCKED";

    const message = isBlocked ? " BLOCKED User " : " ACTIVE User ";
    const statusCode = isBlocked ? httpStatus.FORBIDDEN : httpStatus.OK;

    sendResponse(res, {
      success: true,
      statusCode,
      message,
      data: { isActive },
    });
  }
);

const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await UserServices.deleteUser(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User deleted successfully",
      data: user,
    });
  }
);

export const userControllers = {
  createUser,
  getAllUsers,
  updatedUser,
  deleteUser,
  checkBlockedStatus,
};
