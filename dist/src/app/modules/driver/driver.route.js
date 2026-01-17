"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoutes = void 0;
const express_1 = __importDefault(require("express"));
const driver_controller_1 = require("./driver.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.post("/drivers", (0, checkAuth_1.checkAuth)(user_interface_1.Role.Admin, user_interface_1.Role.Driver, user_interface_1.Role.Rider), driver_controller_1.getDriverController.registerDriver);
router.post("/ride/:rideId/action", (0, checkAuth_1.checkAuth)(user_interface_1.Role.Rider, user_interface_1.Role.Driver, user_interface_1.Role.Admin), driver_controller_1.getDriverController.acceptOrRejectRide);
router.patch("/rides/:rideId/status", (0, checkAuth_1.checkAuth)(user_interface_1.Role.Rider, user_interface_1.Role.Driver, user_interface_1.Role.Admin), driver_controller_1.getDriverController.updateRideStatus);
router.get("/earnings", (0, checkAuth_1.checkAuth)(user_interface_1.Role.Admin, user_interface_1.Role.Driver, user_interface_1.Role.Rider), driver_controller_1.getDriverController.getEarningsHistory);
router.patch("/availability", (0, checkAuth_1.checkAuth)(user_interface_1.Role.Admin, user_interface_1.Role.Driver, user_interface_1.Role.Rider), driver_controller_1.getDriverController.setAvailabilityStatus);
exports.DriverRoutes = router;
