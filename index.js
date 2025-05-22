import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import express from "express";
import "dotenv/config";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import superadminRoutes from "./routes/superadmin.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import detailRoutes from "./routes/details.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectDb from "./config/db.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/superadmin", superadminRoutes);
app.use("/admin", adminRoutes);
app.use("/details", detailRoutes);

app.use("/public", express.static(path.join(__dirname, "public")));

// image url => http://localhost:5000/public/events/
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server has started successfully on port ${port}`);
  connectDb().catch((err) => console.log(err));
});
