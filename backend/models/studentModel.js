import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  enrollmentNo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    // required: true,
  },
  lastName: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    default: "default-profile.png",
  },
}, { timestamps: true });

const StudentModel = mongoose.model("Student", studentSchema);

export default StudentModel;