import express, { Application, RequestHandler } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth"; // no .ts extension here

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

const WHITELIST = [process.env.CLIENT_URL || "http://localhost:3000"];
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || WHITELIST.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 2️⃣ Custom headers middleware for fine-grained control (runs after cors())
const customCorsHeaders: RequestHandler = (req, res, next) => {
  const allowedOrigin = process.env.CLIENT_URL || "http://localhost:3000";
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
};
app.use(customCorsHeaders);

// 3️⃣ Body parsing & routes
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Health Check");
});

// 4️⃣ DB connection
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() =>
    console.log("MongoDB connected", mongoose?.connection?.db?.databaseName)
  )
  .catch((err: unknown) => console.error("MongoDB connection error:", err));

// 5️⃣ Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
