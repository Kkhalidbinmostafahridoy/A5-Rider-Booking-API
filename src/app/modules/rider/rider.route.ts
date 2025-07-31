import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { getRideHistory, riderController } from "./rider.controller";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validatorRequest";
import { requestRideSchema } from "./ride.validation";

const router = Router();

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

router.get("/history", checkAuth(Role.Rider), getRideHistory);

export const RiderRoutes = router;
