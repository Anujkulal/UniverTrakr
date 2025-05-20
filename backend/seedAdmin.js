import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import UserModel from "./models/userModel.js";
import AdminModel from "./models/adminModel.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // Clear any existing admin records
    await UserModel.deleteMany({});
    await AdminModel.deleteMany({});

    // Insert new sample admin credentials and details
    await UserModel.create({
      userId: "admin123",
      password: "admin123",
      role: "Admin",
    });

    await AdminModel.create({
      adminId: "admin123",
      firstname: "College",
      middlename: "",
      lastname: "Admin",
      email: "admin@gmail.com",
      phone: "1234567890",
      gender: "Male",
      // type: "Admin",
      // profile: "admin.jpg",
    });

    const userDetails = await UserModel.findOne({ userId: "admin123" });
    const adminDetails = await AdminModel.findOne({ adminId: "admin123" });
    console.log("Admin details: ", userDetails, adminDetails);
  
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error while seeding:", error);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedAdmin();
