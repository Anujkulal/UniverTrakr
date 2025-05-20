import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    default: "default-profile.png",
    }
}, { timestamps: true });

const facultyModel = mongoose.model("Faculty", facultySchema);

export default facultyModel;