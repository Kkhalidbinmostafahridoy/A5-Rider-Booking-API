import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

router.post("/register", userControllers.createUser);
router.get("/all-users", userControllers.getAllUsers);
router.patch("/:id", userControllers.updatedUser);
router.get("/:id", userControllers.checkBlockedStatus);
router.delete("/:id", userControllers.deleteUser);

export const UserRoutes = router;
