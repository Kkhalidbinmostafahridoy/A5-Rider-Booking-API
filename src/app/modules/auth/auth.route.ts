import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/login", AuthController.credentialsLogin);
router.post("/register", AuthController.registerUser);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);
// router.post(
//   "/reset-Password",
//   checkAuth(Role.Admin, Role.Rider, Role.Driver),
//   AuthController.resetPassword
// );

export const AuthRoutes = router;
