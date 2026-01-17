"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
const User = {
    // Mock Mongoose Model
    findOne: (query) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            toObject: () => ({ email: "test@example.com", password: "hashedpassword" }),
        });
    }),
    create: (data) => __awaiter(void 0, void 0, void 0, function* () { return ({ toObject: () => data }); }),
};
const bcryptjs = {
    compare: (p1, p2) => __awaiter(void 0, void 0, void 0, function* () { return true; }),
    hash: (p, salt) => __awaiter(void 0, void 0, void 0, function* () { return "newhashedpassword"; }),
};
const createUserTokens = (user) => ({
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
const credentialsLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 🔑 FIX: Safe destructuring and input check
    const { email, password } = payload || {};
    if (!email || !password) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email and password are required for login.");
    }
    const isUserExists = yield User.findOne({ email });
    if (!isUserExists) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found");
    }
    // NOTE: The mock bcrypt.compare returns true for demonstration
    const isPasswordMatch = yield bcryptjs.compare(password, isUserExists.toObject().password);
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password");
    }
    const userTokens = createUserTokens(isUserExists);
    const _a = isUserExists.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest, // User data without the password hash
    };
});
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 🔑 FIX: Safe destructuring and input check
    const { name, email, password, phone, address, role } = payload || {};
    if (!name || !email || !password || !phone || !address || !role) {
        throw new AppError(httpStatus.BAD_REQUEST, "All fields are required for registration.");
    }
    const isUserExists = yield User.findOne({ email });
    if (isUserExists) {
        throw new AppError(httpStatus.CONFLICT, "A user with this email already exists.");
    }
    // NOTE: The mock bcrypt.hash returns a string for demonstration
    const hashedPassword = yield bcryptjs.hash(password, 10); // Using 10 as a mock salt round
    const userData = {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role,
    };
    const newUser = yield User.create(userData);
    const userTokens = createUserTokens(newUser);
    const _a = newUser.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest,
    };
});
// ... other service functions (getNewAccessToken, resetPassword) ...
exports.AuthServices = {
    credentialsLogin,
    registerUser,
    // getNewAccessToken,
    // resetPassword,
};
