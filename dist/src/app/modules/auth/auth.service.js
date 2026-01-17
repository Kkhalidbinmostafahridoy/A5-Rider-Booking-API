"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const userTokens_1 = require("../../utils/userTokens");
const credentialsLogin = async (payload) => {
    const { email, password } = payload;
    const isUserExists = await user_model_1.User.findOne({ email });
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User not found");
    }
    const isPasswordMatch = await bcryptjs_1.default.compare(password, isUserExists.password);
    if (!isPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Incorrect password");
    }
    const userTokens = (0, userTokens_1.createUserTokens)(isUserExists);
    const { password: pass, ...rest } = isUserExists.toObject();
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest,
    };
};
const registerUser = async (payload) => {
    const { name, email, password, phone, address, role } = payload;
    const isUserExists = await user_model_1.User.findOne({ email });
    if (isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "A user with this email already exists.");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const userData = {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role,
    };
    const newUser = await user_model_1.User.create(userData);
    const userTokens = (0, userTokens_1.createUserTokens)(newUser);
    const { password: pass, ...rest } = newUser.toObject();
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest,
    };
};
const getNewAccessToken = async (refreshToken) => {
    const NewAccessToken = await (0, userTokens_1.createNewAccessAndRefreshToken)(refreshToken);
    return {
        accessToken: NewAccessToken,
    };
};
const resetPassword = async (oldPassword, newPassword, decodedToken) => {
    const user = await user_model_1.User.findById(decodedToken.userId);
    const isOldPasswordMatch = await bcryptjs_1.default.compare(oldPassword, user?.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old Password doesn't match");
    }
    user.password = await bcryptjs_1.default.hash(newPassword, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    user?.save();
};
exports.AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword,
    registerUser,
};
