import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
  faculty: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    // required: true,
  }
}, { timestamps: true });

const MaterialModel = mongoose.model("Material", MaterialSchema);

export default MaterialModel;