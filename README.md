Rider Functionality

Middleware: checkAuth.ts Ensures role-based access control. Checks if the decoded token's role is in the allowed list (['RIDER']). Example:

checkAuth(Role.Rider) If decoded.role !== 'RIDER', it throws:

throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to access this route');

Rider Controller: rider.controller.ts

requestRide Creates a new ride document for a rider.
Validates if rider already has a pending/accepted ride.

Stores pickupLocation and destinationLocation.

Key logic:

const hasActiveRide = await Ride.findOne({ riderId, status: { $in: ['requested', 'accepted'] } }); if (hasActiveRide) throw new AppError(...); 2. cancelRide Only allows cancellation if:

Ride is requested or accepted

Ride was created within the last 10 minutes

Checks if the rider owns the ride.

Key logic:

if (ride.riderId.toString() !== riderId) throw new AppError(...); const timeLimit = new Date(ride.createdAt); timeLimit.setMinutes(timeLimit.getMinutes() + 10); if (new Date() > timeLimit) throw new AppError(...); 3. rideHistory Fetches all rides for the logged-in rider.

Aggregates total rides, cancelled rides, etc.

Key logic:

const totalRequested = rides.filter(r => r.status === 'requested').length;

Model: ride.model.ts

Includes fields like:

riderId, pickupLocation, destinationLocation, status

Default status = "requested"

Timestamps enabled

🛡 Auth and Role Enums In user.interface.ts:

export enum Role { Rider = "RIDER", Driver = "DRIVER", Admin = "ADMIN", USER="USER, } Token must carry:

{ "userId": "...", "role": "RIDER" }

✅ JWT Token Rider must send token via:

Authorization: Bearer Token payload must include "role": "RIDER"

Typical Folder Structure

src/ ├── modules/ │ └── rider/ │ ├── rider.controller.ts │ ├── rider.routes.ts │ ├── rider.validation.ts │ └── user.interface.ts │ ├── user.model.ts ├── middlewares/ │ └── checkAuth.ts

# Driver Module

📁 Module Structure Overview
Your Driver module contains:

✅ Model: driver.model.ts

✅ Controller: driver.controller.ts

✅ Service: driver.service.ts

✅ Routes: driver.route.ts

✅ Middleware: checkAuth.ts

✅ Common Enums & Interfaces: driver.constant.ts, driver.interface.ts

also use:

🧩 Role-based access control

🧠 Mongoose ODM

🔐 JWT authentication

📦 Async error handling with catchAsync

📤 Standardized response format with sendResponse

driver.model.ts

interface IDriver {
name: string;
phone: string;
email: string;
licenseNumber: string;
vehicleInfo: {
type: string;
model: string;
color: string;
plateNumber: string;
};
availability: "online" | "offline";
earnings: number;
userId: Types.ObjectId;
}
✅ Features:
References userId to associate the driver with a user.

vehicleInfo is nested with required fields and a unique plateNumber.

Indexed fields for fast queries (email, licenseNumber, plateNumber).

Mongoose timestamps for audit tracking.

🧠 Driver Logic and Features

1. 🔐 Driver Registration
   Route: POST /api/v1/driver/drivers
   Middleware: checkAuth(Role.Admin, Role.Driver, Role.Rider)

Summary:

Checks if user with same email or driver with same license exists.

Validates vehicle info.

Creates a new user with hashed password, and assigns Role.Driver.

Creates associated driver document and returns access/refresh tokens.

Security:

Only accessible to Admins, Drivers, and Riders.

Password is hashed using bcryptjs.

2. 🔁 Update Ride Status
   Route: PATCH /api/v1/driver/rides/:rideId/status
   Allowed status changes:
   accepted → picked_up → in_transit → completed

Logic:

Only the assigned driver can update the ride.

Uses strong business logic to restrict invalid transitions.

Sets timestamps like pickupTime, inTransitTime, completedTime.

3. ☑️ Accept or Reject Ride
   Route: POST /api/v1/driver/ride/:rideId/action
   Body: { action: "accept" | "reject" }

Logic:

Ensures ride is in requested or pending state.

If accepted, sets driver ID and status.

If rejected, updates status to rejected.

Security:

Role-based guard (checkAuth) restricts access to Riders, Drivers, Admins.

4. 🟢 Set Availability
   Route: PATCH /api/v1/driver/availability
   Body: { availability: "online" | "offline" }

Logic:

Updates the availability field in driver profile.

Looks up driver using the userId extracted from JWT.

5. 💰 View Earnings
   Route: GET /api/v1/driver/earnings

Logic:

Aggregates all completed rides for the authenticated driver.

Calculates total earnings.

Returns ride info with pickup/dropoff and fare.

🔐 Authentication & Authorization
Role-based access control using checkAuth(...roles).

JWT-based user authentication.

Only permitted roles can access protected routes (like ride updates or driver creation).

Driver-user linkage is enforced using userId.

📤 Responses
All responses use this consistent structure:

{
success: boolean;
statusCode: number;
message: string;
data: any;
}
❌ Error Handling
Errors like:

"Driver not found"

"Invalid ride status"

"Unauthorized action"
...are handled using AppError and propagated via catchAsync.

🔐 Auth Module
This module handles the core user authentication logic including:

Login with email/password

User registration (with hashed passwords)

JWT-based token issuance (access + refresh)

Secure password reset

Logout

Middleware-based route protection

📁 Module Structure

src/
├── modules/
│ └── auth/
│ ├── auth.controller.ts ✅
│ ├── auth.service.ts ✅
│ ├── auth.route.ts ✅
├── middlewares/
│ └── checkAuth.ts ✅
├── utils/
│ ├── jwt.ts ✅
│ ├── userTokens.ts ✅
│ ├── setCookie.ts ✅
│ └── sendResponse.ts ✅
├── errorHelpers/
│ └── AppError.ts ✅
📌 Features & Logic Breakdown

1. Login (POST /api/v1/auth/login)
   Input: { email, password }

Validates credentials:

Verifies user existence by email

Compares plaintext password with hashed version using bcryptjs

If valid:

Creates new access + refresh tokens

Sets both tokens as cookies

Returns user (excluding password)

Security:

Uses bcrypt.compare() to validate password

Uses HttpOnly cookies to store tokens (resists XSS)

2. Register (POST /api/v1/auth/register)
   Input: { name, email, phone, address, role, password }

Checks if user already exists

Hashes password using bcrypt

Creates new user in DB

Generates JWT tokens

Sets tokens in cookie

Returns user data (excluding password)

Note:

Roles (rider, driver, admin) are allowed via payload

Auto-login after registration via token generation

3. Refresh Token (POST /api/v1/auth/refresh-token)
   Pulls refreshToken from cookies

Validates it

If valid:

Issues a new access token

Sets token in cookie

Returns new access token

Key Concepts:

Uses createNewAccessAndRefreshToken(refreshToken) logic internally

Promotes seamless session renewal without re-login

4. Logout (POST /api/v1/auth/logout)
   Clears cookies for:

accessToken

refreshToken

Sends success response

Result: Invalidates user session on client

5. Reset Password (POST /api/v1/auth/reset-password)
   Requires JWT-authenticated user

Payload: { oldPassword, newPassword }

Compares old password with stored hash

If matches:

Hashes and saves the new password

Security:

Uses checkAuth(...) middleware to ensure only logged-in users can access

Passwords never stored in plain text

🍪 Cookie Handling (setAuthCookie)
This sets both access & refresh tokens as cookies:

res.cookie("accessToken", token, {
httpOnly: true,
sameSite: "lax",
secure: false,
});
Consider making secure: true in production with HTTPS.

📤 Response Format
All API responses use a standardized format via sendResponse():

{
success: true,
statusCode: 200,
message: "Some message",
data: { ... }
}
🔐 Middleware: checkAuth
Verifies accessToken

Extracts user info from token

Injects req.user with decoded token payload

Restricts routes based on role (Admin, Rider, Driver)

🧠 Tokens: JWT + Refresh
Tokens signed using jsonwebtoken

Token utils: generateToken, verifyToken

Token lifespan:

accessToken: Short ( 2d)

refreshToken: Long ( 30d)

Tokens are generated in: userTokens.ts

✅ 1. Interface Definitions (user.interface.ts)
Defines the structure of the user system.

Key Enums:
Role – Defines 5 user roles: Admin, User, Rider, Driver, SuperAdmin

IsActive – User status can be: ACTIVE, INACTIVE, or BLOCKED

Interface: IUser
Core fields: name, email, password, phone, address, role, auths (auth provider info)

Optional links: rider or driver (ObjectId references)

Optional flags: isDeleted, isVerified, isActive

Method: Optional comparePassword for password validation (useful in auth flow)

✅ 2. Mongoose Model (user.model.ts)
Defines how the user is stored in MongoDB.

Validates against enums (Role, IsActive)

auths: Stores third-party login data (Google, credentials)

Default values:

role: User

isActive: ACTIVE

isDeleted: false

isVerified: false

timestamps: true: Automatically tracks createdAt, updatedAt

✅ 3. Validation Schemas (user.validation.ts)
Uses zod for validating incoming user data.

createUserZodSchema
Enforces:

Valid name length

Proper email format

Strong password (uppercase, lowercase, number, special char)

Valid Bangladeshi phone number (starts with 013–019, 11 digits)

UpdateZodSchema
All fields optional

Password still validated for strength

Allows updating isActive, role, etc.

✅ 4. User Service Functions (user.service.ts)
Contains all business logic for managing users.

Main Functions:
createUser: Hashes password, stores user, sets default provider as "credentials"

getAllUsers: Returns all users with a count

updateUser:

Allows only Admin to update role, isActive, isDeleted, isVerified

Other roles are restricted from modifying sensitive fields

Hashes new password before saving

checkIfUserBlocked: Returns isActive status

deleteUser: Hard-deletes user from DB

Security Logic:
Role-based field update restriction to prevent unauthorized changes

✅ 5. User Controllers (user.controller.ts)
Wraps service functions in Express handlers with error catching.

Endpoints:
createUser: Registers a user

getAllUsers: Returns all users (admin-only)

updatedUser: Applies updates (role-checked)

checkBlockedStatus: Checks if user is BLOCKED

deleteUser: Admin-only delete
