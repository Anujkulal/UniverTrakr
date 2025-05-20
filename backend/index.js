import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import adminRoute from "./routes/adminApi/adminRoute.js";
import facultyRoute from "./routes/facultyApi/facultyRoute.js";
import studentRoute from "./routes/studentApi/studentRoute.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// // Log variable outputs
// console.log("import.meta.url:", import.meta.url);
// console.log("__filename:", __filename);
// console.log("__dirname:", __dirname);
// console.log("media path:", path.join(__dirname, "media"));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/media", express.static(path.join(__dirname, "media")));

app.use("/api/admin", adminRoute);
app.use("/api/faculty", facultyRoute);
app.use("/api/student", studentRoute);

app.listen(port, () => {
  console.log(`Server Listening On http://localhost:${port}`);
});
