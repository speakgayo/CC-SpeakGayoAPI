// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import tourismRoutes from "./routes/tourism.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch((error) => console.error("Database connection error:", error));

const db = mongoose.connection;
db.on("error", (error) => console.error(error));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true }));

app.use("/tourism", tourismRoutes);
app.use("/auth", authRoutes); // Add auth routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});