import express from "express";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import dotenv from "dotenv";
// Import CORS if you're going to use it
import cors from "cors";

dotenv.config();

const app = express();

// Use CORS middleware if needed
app.use(cors());

// Use built-in middleware to parse JSON bodies
app.use(express.json());

// Database connection
connectDB();

// Define routes with the correct base path
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Base route for simple API check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
