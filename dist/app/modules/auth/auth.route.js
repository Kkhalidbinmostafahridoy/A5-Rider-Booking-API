"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/login", auth_controller_1.AuthController.credentialsLogin);
router.post("/register", auth_controller_1.AuthController.registerUser);
router.post("/refresh-token", auth_controller_1.AuthController.getNewAccessToken);
router.post("/logout", auth_controller_1.AuthController.logout);
// router.post(
//   "/reset-Password",
//   checkAuth(Role.Admin, Role.Rider, Role.Driver),
//   AuthController.resetPassword
// );
exports.AuthRoutes = router;
