import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { //USN
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Student", "Faculty", "Admin"],
      default: "Student",
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
