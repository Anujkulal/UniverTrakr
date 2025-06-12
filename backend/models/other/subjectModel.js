import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const SubjectModel = mongoose.model("Subject", SubjectSchema);

export default SubjectModel;