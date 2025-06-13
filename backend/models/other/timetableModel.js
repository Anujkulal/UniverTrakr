import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  timings: [String],
  data: [[String]],
  

}, { timestamps: true });

const TimetableModel = mongoose.model("Timetable", TimetableSchema);

export default TimetableModel;