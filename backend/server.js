// server.js

import express from 'express';
import connectDB from './db/db.js'; // Import fungsi koneksi MongoDB
import cors from 'cors';
import tourismRoutes from './routes/tourism.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/tourism", tourismRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});