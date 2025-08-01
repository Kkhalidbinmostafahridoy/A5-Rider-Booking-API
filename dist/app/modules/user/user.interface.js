"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsActive = exports.Role = void 0;
var Role;
(function (Role) {
    Role["Admin"] = "ADMIN";
    Role["User"] = "USER";
    Role["Rider"] = "RIDER";
    Role["Driver"] = "DRIVER";
    Role["SuperAdmin"] = "SuperAdmin";
})(Role || (exports.Role = Role = {}));
var IsActive;
(function (IsActive) {
    IsActive["Active"] = "ACTIVE";
    IsActive["Inactive"] = "INACTIVE";
    IsActive["Blocked"] = "BLOCKED";
})(IsActive || (exports.IsActive = IsActive = {}));
