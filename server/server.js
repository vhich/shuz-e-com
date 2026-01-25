import "dotenv/config";
import express from "express";
import connectDB from "./config/database.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { urlencoded } from "express";
import cookieParser from "cookie-parser";
import router from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 4001;
connectDB();

const allowedOrigins = [
  //   process.env.FRONTEND_URL,
  "http://10.102.130.138:3001",
  "http://10.102.130.138:3002",
].filter(Boolean);

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: true,
    referrerPolicy: { policy: "same-origin" },
  }),
); // Security
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error("CORS Policy blocked this origin"), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Secure API is running");
});

app.use("/api/admin", router);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`),
);
