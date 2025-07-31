import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
// import path from "path";
import { AuthRoutes } from "../modules/auth/auth.route";
import { RiderRoutes } from "../modules/rider/rider.route";

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
];

modulesRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
