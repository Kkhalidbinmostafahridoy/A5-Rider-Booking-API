"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
// import tr from "zod/v4/locales/tr.cjs";
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const createUser = async (payload) => {
    const { email, password, ...rest } = payload;
    const isUserExists = await user_model_1.User.findOne({ email });
    if (isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already Exists");
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const user = await user_model_1.User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest,
    });
    return user;
};
const getAllUsers = async () => {
    const users = await user_model_1.User.find({});
    const totalUsers = await user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers,
        },
    };
};
const updateUser = async (userId, payload, decodedToken) => {
    const ifUserExists = await user_model_1.User.findById(userId);
    if (!ifUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not Found");
    }
    const restrictedRoles = [user_interface_1.Role.User, user_interface_1.Role.Rider, user_interface_1.Role.Driver];
    // Fields only Admin can update
    const restrictedFields = ["role", "isActive", "isDeleted", "isVerified"];
    if (restrictedRoles.includes(decodedToken.role)) {
        const attemptedRestrictedUpdate = restrictedFields.some((field) => Object.prototype.hasOwnProperty.call(payload, field));
        if (attemptedRestrictedUpdate) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to Update this user information");
        }
    }
    // Handle password update with hashing
    if (payload.password) {
        payload.password = await bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const newUpdatedUser = await user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return newUpdatedUser;
};
const checkIfUserBlocked = async (id) => {
    const user = await user_model_1.User.findById(id);
    if (!user) {
        throw new Error("User not found");
    }
    return user.isActive;
};
const deleteUser = async (id) => {
    const user = await user_model_1.User.findByIdAndDelete(id);
    return user;
};
exports.UserServices = {
    createUser,
    getAllUsers,
    updateUser,
    deleteUser,
    checkIfUserBlocked,
};
