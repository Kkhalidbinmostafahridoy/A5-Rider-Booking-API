"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { NextFunction, Request, Response } from "express";
// import { catchAsync } from "../../utils/catchAsync";
// import { sendResponse } from "../../utils/sendResponse";
// import httpStatus from "http-status-codes";
// import { AuthServices } from "./auth.service";
// import AppError from "../../errorHelpers/AppError";
// import { fa } from "zod/v4/locales/index.cjs";
// import { setAuthCookie } from "../../utils/setCookie";
// import { UserServices } from "../user/user.service";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const auth_service_1 = require("./auth.service");
// --- Mock Utility Functions (Replace with your actual files) ---
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
const sendResponse = (res, data) => {
    res.status(data.statusCode).json(data);
};
const setAuthCookie = (res, data) => {
    res.cookie("accessToken", data.accessToken, { httpOnly: true, secure: true });
    res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: true,
    });
};
// ----------------------------------------------------------------
const credentialsLogin = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 💡 CRITICAL: req.body is passed directly to the service
    const loginInfo = yield auth_service_1.AuthServices.credentialsLogin(req.body);
    setAuthCookie(res, loginInfo);
    sendResponse(res, {
        success: true,
        message: "User login successfully",
        statusCode: http_status_codes_1.default.OK,
        data: loginInfo.user, // Send user data, but tokens are in cookies/loginInfo
    });
}));
const registerUser = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 💡 CRITICAL: req.body is passed directly to the service
    const registerInfo = yield auth_service_1.AuthServices.registerUser(req.body);
    setAuthCookie(res, registerInfo);
    sendResponse(res, {
        success: true,
        message: "User registered successfully",
        statusCode: http_status_codes_1.default.CREATED,
        data: registerInfo.user,
    });
}));
const getNewAccessToken = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    // ... logic for token refresh ...
    // const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
    // setAuthCookie(res, tokenInfo);
    // ... send response ...
}));
const logout = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Clear cookies logic
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    sendResponse(res, {
        success: true,
        message: "User logout successfully",
        statusCode: http_status_codes_1.default.OK,
        data: null,
    });
}));
exports.AuthController = {
    credentialsLogin,
    registerUser,
    getNewAccessToken,
    logout,
    // resetPassword, // if implemented
};
