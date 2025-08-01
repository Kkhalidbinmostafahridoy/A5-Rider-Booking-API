import express from "express";
import { getDriverController } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post(
  "/drivers",
  checkAuth(Role.Admin, Role.Driver, Role.Rider),
  getDriverController.registerDriver
);
router.patch(
  "/ride/:rideId/action",
  checkAuth(Role.Driver),
  getDriverController.acceptOrRejectRide
);

export const DriverRoutes = router;
