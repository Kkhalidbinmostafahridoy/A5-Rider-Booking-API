"use strict";
// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import dotenv from "dotenv";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
// dotenv.config();
// interface EnvConfig {
//   PORT: string;
//   DB_URL: string;
//   NODE_ENV: "development" | "production";
//   BCRYPT_SALT_ROUND: string;
//   JWT_ACCESS_SECRET: string;
//   JWT_REFRESH_SECRET: string;
//   JWT_REFRESH_EXPIRES: string;
//   JWT_ACCESS_EXPIRES: string;
//   ADMIN_EMAIL: string;
//   ADMIN_PASSWORD: string;
//   FRONTEND_URL?: string;
// }
// const loadEnvVariable = (): EnvConfig => {
//   const requiredEnvVariables: string[] = [
//     "PORT",
//     "DB_URL",
//     "NODE_ENV",
//     "BCRYPT_SALT_ROUND",
//     "JWT_ACCESS_SECRET",
//     "JWT_REFRESH_SECRET",
//     "JWT_REFRESH_EXPIRES",
//     "JWT_ACCESS_EXPIRES",
//     "ADMIN_EMAIL",
//     "ADMIN_PASSWORD",
//     "FRONTEND_URL",
//   ];
//   requiredEnvVariables.forEach((key) => {
//     if (!process.env[key]) {
//       throw new Error(`Missing environment variables ${key}`);
//     }
//   });
//   return {
//     PORT: process.env.PORT as string,
//     DB_URL: process.env.DB_URL!,
//     NODE_ENV: process.env.NODE_ENV as "development" | "production",
//     BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
//     JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
//     JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
//     JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
//     JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
//     ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
//     ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
//     FRONTEND_URL: process.env.FRONTEND_URL as string,
//   };
// };
// export const envVars = loadEnvVariable();
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariable = () => {
    const requiredEnvVariables = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND",
        "JWT_ACCESS_SECRET",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES",
        "JWT_ACCESS_EXPIRES",
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "FRONTEND_URLS", // ✅ updated
    ];
    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing environment variable ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        // ✅ split comma-separated URLs into an array
        FRONTEND_URL: process.env.FRONTEND_URL
            ? process.env.FRONTEND_URL.split(",")
            : [],
    };
};
exports.envVars = loadEnvVariable();
