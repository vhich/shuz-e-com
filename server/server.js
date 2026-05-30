import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { urlencoded } from "express";
import helmet from "helmet";
import { createServer } from "http";
import morgan from "morgan";
import os from "os";
import { Server } from "socket.io";
import connectDB from "./config/database.js";
import { stripeWebhook } from "./controllers/orderController.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import adminAllProductRouter from "./routes/adminProductRoutes.js";
import router from "./routes/adminRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import clientProductRouter from "./routes/clientFetchProductsRoute.js";
import clientRouter from "./routes/clientRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

const app = express();
app.set("trust proxy", 1);
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin:
      "http://localhost:3001" ||
      "http://localhost:3002" ||
      "https://shuz-e-com-frontend-client.onrender.com" ||
      "https://shuz-e-com-frontend-admin.onrender.com",
    methods: ["GET", "POST"],
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
const PORT = process.env.PORT || 10000;
connectDB();

// const allowedOrigins = [
//   "https://shuz-e-com-frontend.onrender.com",
//   process.env.CLIENT_FRONTEND_URL,
//   process.env.ADMIN_FRONTEND_URL,
// ].filter(Boolean);

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3002",
      "https://shuz-e-com-frontend-client.onrender.com",
      "https://shuz-e-com-frontend-admin.onrender.com",
      "https://shuz-e-com-frontend-admin.onrender.com/api",
      "https://shuz-e-com-frontend-client.onrender.com/api",
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // MUST include OPTIONS
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Cache-Control",
    ],
  }),
);

// STRIPE WEBHOOK MUST BE BEFORE express.json()
app.post(
  "/api/order/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);
// app.options("{/*path}?", cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://js.stripe.com"], // Allow Stripe scripts
        frameSrc: ["'self'", "https://js.stripe.com"], // Allow the payment iframe
        connectSrc: ["'self'", "https://api.stripe.com"], // Allow talking to Stripe API
      },
    },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Helps with OAuth/Stripe
    crossOriginResourcePolicy: { policy: "cross-origin" },
    referrerPolicy: { policy: "no-referrer" },
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Secure API is running");
});

app.use("/api", rateLimiter);
app.use("/api/admin", router);
app.use("/api", adminAllProductRouter);
app.use("/api/order", orderRouter);
app.use("/api/client", clientRouter);
app.use("/api/cart", cartRouter);
app.use("/api/me", clientProductRouter)

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
