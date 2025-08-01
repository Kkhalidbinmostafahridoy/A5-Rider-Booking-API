import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { RiderRoutes } from "../modules/rider/rider.route";
import { DriverRoutes } from "../modules/driver/driver.route";

export const router = Router();

const modulesRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/rider",
    route: RiderRoutes,
  },
  {
    path: "/driver",
    route: DriverRoutes,
  },
];

modulesRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
