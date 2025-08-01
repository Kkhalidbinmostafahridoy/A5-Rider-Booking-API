/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { fa } from "zod/v4/locales/index.cjs";
import { setAuthCookie } from "../../utils/setCookie";
import { UserServices } from "../user/user.service";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      message: "User login successfully",
      statusCode: httpStatus.OK,
      data: loginInfo,
    });
  }
);

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const registerInfo = await AuthServices.registerUser(req.body);

    setAuthCookie(res, registerInfo);

    sendResponse(res, {
      success: true,
      message: "Rider registered successfully", // Corrected message
      statusCode: httpStatus.CREATED, // Corrected status code
      data: registerInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "no refresh token recieved from cookies"
      );
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      message: "New access token Retrived successfully",
      statusCode: httpStatus.OK,
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      message: "User logout successfully",
      statusCode: httpStatus.OK,
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;

    const oldPassword = req.body.oldPassword;

    const decodedToken = (req as any).user; //user error line vercel thats why user req as any

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

    sendResponse(res, {
      success: true,
      message: "Password Changed successfully",
      statusCode: httpStatus.OK,
      data: null,
    });
  }
);

export const AuthController = {
  credentialsLogin,
  registerUser,
  getNewAccessToken,
  logout,
  resetPassword,
};
