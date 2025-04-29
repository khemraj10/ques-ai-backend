import express from "../src/node_modules/@types/express";
import authRoutes from "./auth";

const app = express();
app.use("/api/auth", authRoutes);
