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
router.post(
  "/ride/:rideId/action",
  checkAuth(Role.Rider, Role.Driver, Role.Admin),
  getDriverController.acceptOrRejectRide
);

router.patch(
  "/rides/:rideId/status",
  checkAuth(Role.Rider, Role.Driver, Role.Admin),
  getDriverController.updateRideStatus
);

router.get(
  "/earnings",
  checkAuth(Role.Admin, Role.Driver, Role.Rider),
  getDriverController.getEarningsHistory
);

router.patch(
  "/availability",
  checkAuth(Role.Admin, Role.Driver, Role.Rider),
  getDriverController.setAvailabilityStatus
);

export const DriverRoutes = router;
