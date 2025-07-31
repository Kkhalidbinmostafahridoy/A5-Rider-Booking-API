import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { riderController } from "./rider.controller";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validatorRequest";
import { requestRideSchema } from "./ride.validation";

const router = Router();

// Rider actions
router.post(
  "/request",
  checkAuth(Role.Rider),
  validateRequest(requestRideSchema),
  riderController.requestRide
);

router.patch(
  "/:rideId/cancel",
  checkAuth(Role.Rider),
  riderController.cancelRide
);

router.get("/history", checkAuth(Role.Rider), riderController.getRideHistory);

export const RiderRoutes = router;
