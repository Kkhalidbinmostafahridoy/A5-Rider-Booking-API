/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import express, { NextFunction, Request, Response } from "express";
// import { UserRoutes } from "./app/modules/user/user.route";
// import cors from "cors";
// import { router } from "./app/routes";
// import { AnyARecord } from "dns";
// import { any, success } from "zod";
// import { envVars } from "./app/config/env";
// import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
// import { notFound } from "./app/middlewares/notFound";
// import cookieParser from "cookie-parser";

// const app = express();

// app.use(express.json());

// app.use(cookieParser());

// // ✅ define allowed origins from env
// const corsOptions = {
//   origin: envVars.FRONTEND_URLS, // must match frontend exactly
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // allow all methods
//   allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // allow headers you use
// };

// app.use("/api", router);

// app.get("/", async (req: Request, res: Response) => {
//   res.status(200).json({
//     message: "Welcome to A5-Ride-Booking-System-API",
//   });
// });

// app.use(globalErrorHandler);

// app.use(notFound);

// export default app;

// /* eslint-disable @typescript-eslint/no-explicit-any */

/////
// --- This is an EXAMPLE of how to set up your server for CORS ---

// import express, { NextFunction, Request, Response } from "express";
// import cors from "cors";
// import { envVars } from "./app/config/env"; // Assuming 'app.ts' is in 'src/app' and 'config' is a sibling
// import { AuthRoutes } from "./app/modules/auth/auth.route"; // ⬅️ NEW ATTEMPT: Adjusted path to start from './app/'
// import { UserRoutes } from "./app/modules/user/user.route";

// const app = express();

// // --- 1. CORE MIDDLEWARE & CORS FIX ---

// // Body parser
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // CORS Configuration - FIXING THE BROWSER BLOCK ISSUE
// const allowedOrigins = envVars.FRONTEND_URLS;

// // Ensure frontend URL is included
// const defaultOrigins = [
//   "https://assingment-5-frontend.vercel.app",
//   "http://localhost:3000",
//   "http://localhost:5173",
// ];

// const allOrigins = [...new Set([...allowedOrigins, ...defaultOrigins])];

// const corsOptions: cors.CorsOptions = {
//   // Sets the allowed origins to your Vercel and localhost URLs
//   origin: (origin, callback) => {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     if (allOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(null, true); // For now, allow all origins in production
//     }
//   },
//   methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "X-Requested-With",
//     "Accept",
//     "Origin",
//     "Access-Control-Request-Method",
//     "Access-Control-Request-Headers",
//   ],
//   exposedHeaders: ["Set-Cookie"],
//   credentials: true, // Crucial for sending cookies/auth headers
//   optionsSuccessStatus: 204,
//   preflightContinue: false,
// };

// // Apply CORS middleware BEFORE routes - handles all preflight OPTIONS automatically
// app.use(cors(corsOptions));

// // --- 2. APPLICATION ROUTES ---

// // Example Root Health Check
// app.get("/", (req: Request, res: Response) => {
//   res.status(200).json({
//     message: "Welcome to A5-Ride-Booking-System API",
//     status: "Active",
//     allowedOrigins: allowedOrigins,
//   });
// });

// // Primary Application Routes (e.g., Auth, Users, Rides)
// app.use("/api/auth", AuthRoutes);
// app.use("/api/user", UserRoutes); // <-- Check this line

// // --- 3. GLOBAL ERROR HANDLER ---
// // This prevents unhandled exceptions from causing the HTTP 500 error.
// app.use((err: any, req: Request, res: Response, next: NextFunction) => {
//   // Log the actual error for debugging
//   console.error("[API GLOBAL ERROR]", err.stack || err);

//   // Respond with a 500 status
//   res.status(500).json({
//     success: false,
//     message: err.message || "Internal Server Error. Check server logs.",
//     errorDetails: err,
//   });
// });

// export default app;




import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { envVars } from "./app/config/env";
import { AuthRoutes } from "./app/modules/auth/auth.route";
import { UserRoutes } from "./app/modules/user/user.route";

const app = express();

// --- 1. CORS MIDDLEWARE (MUST BE FIRST) ---
// Manual CORS headers for better Vercel compatibility
app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173", 
    "https://assingment-5-frontend.vercel.app"
  ];
  
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  next();
});

// Backup CORS middleware
const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173", 
      "https://assingment-5-frontend.vercel.app"
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// --- 2. BODY PARSER ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 3. APPLICATION ROUTES ---
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to A5-Ride-Booking-System API",
    status: "Active",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);

// --- 4. 404 HANDLER ---
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// --- 5. GLOBAL ERROR HANDLER ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("[GLOBAL ERROR]", err.stack || err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' && { error: err.stack })
  });
});

export default app;