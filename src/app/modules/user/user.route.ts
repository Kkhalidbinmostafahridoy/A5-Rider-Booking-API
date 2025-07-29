/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import { createUserZodSchema, UpdateZodSchema } from "./user.validation";
// import { AnyZodObject } from "zod";
import { validateRequest } from "../../middlewares/validatorRequest";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);

router.get("/all-users", userControllers.getAllUsers);
router.patch(
  "/:id",
  validateRequest(UpdateZodSchema),
  userControllers.updatedUser
);

router.get("/:id", userControllers.checkBlockedStatus);
router.delete("/:id", userControllers.deleteUser);

export const UserRoutes = router;
