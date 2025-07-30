/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import { createUserZodSchema, UpdateZodSchema } from "./user.validation";
// import { AnyZodObject } from "zod";
import { validateRequest } from "../../middlewares/validatorRequest";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);

router.get("/all-users", checkAuth(Role.Admin), userControllers.getAllUsers);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  userControllers.updatedUser
);

router.get("/:id", checkAuth(Role.Admin), userControllers.checkBlockedStatus);
router.delete("/:id", checkAuth(Role.Admin), userControllers.deleteUser);

export const UserRoutes = router;
