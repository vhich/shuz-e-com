import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import { createServer } from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { urlencoded } from "express";
import cookieParser from "cookie-parser";
import router from "./routes/adminRoutes.js";
import productRouter from "./routes/productRoutes.js";

import os from "os";
import orderRouter from "./routes/orderRoutes.js";
import clientRouter from "./routes/clientRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import { stripeWebhook } from "./controllers/orderController.js";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3002", // Your frontend URL
    credentials: true,
  },
});

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a specific room (e.g., 'admins') to avoid blasting updates to regular customers
  socket.on("joinAdminRoom", () => {
    socket.join("admins");
    console.log("Admin joined the notification room");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
const PORT = process.env.PORT || 4001;
connectDB();

const allowedOrigins = [
  process.env.ADMIN_FRONTEND_URL || "http://localhost:3001",
  process.env.CLIENT_FRONTEND_URL || "http://localhost:3002",
  "http://10.102.130.138:3001",
  "http://10.102.130.138:3002",
  "http://10.55.95.138:3001",
  "http://10.55.95.138:3002",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// STRIPE WEBHOOK MUST BE BEFORE express.json()
app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);
app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: true,
    referrerPolicy: { policy: "same-origin" },
  }),
);
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Secure API is running");
});

app.use("/api/admin", router);
app.use("/api", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/client", clientRouter);
app.use("/api/cart", cartRouter);

httpServer.listen(PORT, "0.0.0.0", () => {
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
