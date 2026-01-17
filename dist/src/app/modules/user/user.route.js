"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
// import { AnyZodObject } from "zod";
const validatorRequest_1 = require("../../middlewares/validatorRequest");
const user_interface_1 = require("./user.interface");
const checkAuth_1 = require("../../middlewares/checkAuth");
const router = (0, express_1.Router)();
router.post("/register", (0, validatorRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.userControllers.createUser);
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interface_1.Role.Admin), user_controller_1.userControllers.getAllUsers);
router.patch("/:id", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.userControllers.updatedUser);
router.get("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.Admin), user_controller_1.userControllers.checkBlockedStatus);
router.delete("/:id", (0, checkAuth_1.checkAuth)(user_interface_1.Role.Admin), user_controller_1.userControllers.deleteUser);
exports.UserRoutes = router;
