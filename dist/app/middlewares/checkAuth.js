"use strict";
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
exports.checkAuth = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No token received");
        }
        const decoded = (0, jwt_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        if (!decoded.userId) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Invalid token: no userId");
        }
        const user = yield user_model_1.User.findById(decoded.userId);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
        }
        if (user.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
        }
        if (user.isActive === user_interface_1.IsActive.Blocked ||
            user.isActive === user_interface_1.IsActive.Inactive) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${user.isActive}`);
        }
        if (!authRoles.includes(decoded.role)) {
            console.log("Decoded role from token:", decoded.role);
            console.log("Authorized roles:", authRoles);
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to access this route");
        }
        req.user = {
            //user error line vercel thats why user req as any
            userId: decoded.userId,
            role: decoded.role,
            email: decoded.email,
        };
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
