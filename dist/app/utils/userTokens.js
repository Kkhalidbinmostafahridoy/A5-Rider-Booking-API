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
exports.createNewAccessAndRefreshToken = exports.createUserTokens = void 0;
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const jwt_1 = require("./jwt");
const user_model_1 = require("../modules/user/user.model");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createUserTokens = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_REFRESH_SECRET, env_1.envVars.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserTokens = createUserTokens;
const createNewAccessAndRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.JWT_REFRESH_SECRET);
    const isUserExists = yield user_model_1.User.findOne({
        email: verifiedRefreshToken.email,
    });
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user does not exists");
    }
    if (isUserExists.isActive === user_interface_1.IsActive.Blocked ||
        isUserExists.isActive === user_interface_1.IsActive.Inactive) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `user is ${isUserExists.isActive}`);
    }
    if (isUserExists.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user is deleted");
    }
    const jwtPayload = {
        userId: isUserExists._id,
        email: isUserExists.email,
        role: isUserExists.role,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    return accessToken;
});
exports.createNewAccessAndRefreshToken = createNewAccessAndRefreshToken;
