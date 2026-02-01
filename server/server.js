import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { urlencoded } from "express";
import cookieParser from "cookie-parser";
import router from "./routes/adminRoutes.js";
import productRouter from "./routes/productRoutes.js";

import os from "os";
import orderRouter from "./routes/orderRoutes.js";

const app = express();
const PORT = process.env.PORT || 4001;
connectDB();

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   // This allows ANY origin (localhost:3001, 3002, or your IP) to connect
//   res.setHeader("Access-Control-Allow-Origin", origin || "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, OPTIONS",
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, X-Requested-With",
//   );
//   res.setHeader("Access-Control-Allow-Credentials", "true");

//   // Handle the "pre-flight" check immediately
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

const allowedOrigins = [
  process.env.ADMIN_FRONTEND_URL || "http://localhost:3001",
  process.env.CLIENT_FRONTEND_URL || "http://localhost:3002",
  "http://10.102.130.138:3001",
  "http://10.102.130.138:3002",
].filter(Boolean);
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Required for cookies/headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow these
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: true,
    referrerPolicy: { policy: "same-origin" },
  }),
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Secure API is running");
});

app.use("/api/admin", router);
app.use("/api", productRouter);
app.use("/api/order", orderRouter);

app.listen(PORT, "0.0.0.0", () => {
  const interfaces = os.networkInterfaces();
  let ipAddress = "localhost";

  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (
        alias.family === "IPv4" &&
        alias.address !== "127.0.0.1" &&
        !alias.internal
      ) {
        ipAddress = alias.address;
      }
    }
  }

  console.log(`-------------------------------------------`);
  console.log(`👟 SHUZ Server is running!`);
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Network: http://${ipAddress}:${PORT}`);
  console.log(`-------------------------------------------`);
});
