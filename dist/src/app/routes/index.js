"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const rider_route_1 = require("../modules/rider/rider.route");
const driver_route_1 = require("../modules/driver/driver.route");
exports.router = (0, express_1.Router)();
const modulesRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
    {
        path: "/rider",
        route: rider_route_1.RiderRoutes,
    },
    {
        path: "/driver",
        route: driver_route_1.DriverRoutes,
    },
];
modulesRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
