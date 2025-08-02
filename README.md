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
