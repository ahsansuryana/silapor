import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.route";
import locationRoutes from "./routes/location.route";
import categoriesRoutes from "./routes/categories.route";
import reportsRoutes from "./routes/reports.route";
import reportImagesRoutes from "./routes/report_images.route";
import assignmentsRoutes from "./routes/assignments.route";
import reportHistoryRoutes from "./routes/report_history.route";
import notificationsRoutes from "./routes/notifications.route";
import staffLocationsRoutes from "./routes/staff_locations.route";
import staffRoutes from "./routes/staff.route";
import usersRoutes from "./routes/users.route";
import cookieParser from "cookie-parser";

const isGlobal = process.env.IS_GLOBAL === "true";
const envFile = isGlobal ? ".env.global" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log(`[ENV] Loading ${envFile} mode`);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5173",
  "https://silapor.nuxantara.site",
  "https://backend-silapor.nuxantara.site",
  "https://vite.nuxantara.site",
  "https://express.nuxantara.site",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  }

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  const start = new Date();
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    const timestamp = new Date().toISOString();
    console.log("[LOG]", timestamp, req.method, req.originalUrl);
    console.log("[REQ] query:", JSON.stringify(req.query));
    console.log("[REQ] body:", JSON.stringify(req.body));
    console.log("[RES] status:", res.statusCode);
    console.log("[RES] body:", JSON.stringify(body));
    console.log(
      "[LOG] duration:",
      `${new Date().getTime() - start.getTime()}ms`,
    );
    return originalJson(body);
  };

  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Hello from Silapor API!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/reports", reportImagesRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/reports", reportHistoryRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/staff-locations", staffLocationsRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/users", usersRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
