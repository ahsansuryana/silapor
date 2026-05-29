import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

const envFile = process.env.IS_GLOBAL === "true" ? ".env.global" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log(`[DB] Loading config from ${envFile}`);

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin123",
  database: process.env.DB_NAME || "silapor_db",
});

pool.on("connect", () => console.log("✅ PostgreSQL connected"));
pool.on("error", (err) => console.error("❌ PostgreSQL error:", err));

export default pool;