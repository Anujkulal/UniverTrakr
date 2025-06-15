import mongoose from "mongoose";

const MarksSchema = new mongoose.Schema({
  enrollmentNo: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  internal: {
    internal1: { type: Number, default: 0 },
    internal2: { type: Number, default: 0 },
  },
  internalAvg: {
    type: Number,
    default: 0,
  },
  assignment: {
    type: Number,
    default: 0,
  },
  totalInternal: {
    type: Number,
    default: 0,
  },
  external: {
    type: Number,
    default: 0,
  },
  totalMarks: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

const MarksModel = mongoose.model("Mark", MarksSchema);

export default MarksModel;