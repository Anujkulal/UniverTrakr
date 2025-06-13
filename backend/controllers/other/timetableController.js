import TimetableModel from "../../models/other/timetableModel.js";

const saveTimetableController = async (req, res) => {
  try {
    const { branch, semester, timings, data } = req.body;
    // console.log(branch, semester, timings, data);
    if (!branch || !semester) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingTimetable = await TimetableModel.findOne({ branch, semester });
    if (existingTimetable) {
      return res.status(400).json({ message: "Timetable for this branch and semester already exists" });
    }
    const timetable = new TimetableModel({ branch, semester, timings, data });
    await timetable.save();
    res.status(201).json({ message: 'Timetable saved successfully', timetable });
  } catch (err) {
    console.error("Error while saving timetable:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTimetableController = async (req, res) => {
  try {
    const timetables = await TimetableModel.find();
    res.status(200).json(timetables);
  } catch (err) {
    console.error("Error while fetching timetable:", err);
    res.status(500).json({ message: "Server error" });
  }
}

const deleteTimetableController = async (req, res) => {
  try {
    const { branch, semester } = req.params;
    const timetable = await TimetableModel.findOneAndDelete({ branch, semester });
    if (!timetable) {
      return res.status(200).json({ message: "Timetable not found" });
    }
    res.status(200).json({ message: "Timetable deleted successfully" });
  } catch (err) {
    console.error("Error while deleting timetable:", err);
    res.status(500).json({ message: "Server error" });
  }
}

const updateTimetableController = async (req, res) => {
  try{
    const { branch, semester } = req.params;
    const { timings, data } = req.body;

    if (!branch || !semester) {
      return res.status(400).json({ message: "Branch and semester are required" });
    }

    const timetable = await TimetableModel.findOneAndUpdate(
      { branch, semester },
      { timings, data },
      { new: true }
    );

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" });
    }

    res.status(200).json({ message: "Timetable updated successfully", timetable });
  }
  catch (err) {
    console.error("Error while updating timetable:", err);
    res.status(500).json({ message: "Server error" });
}
}

// const getBranchSemesterTimetableController = async (req, res) => {
//   try {
//     const { branch, semester } = req.params;
//     const timetable = await TimetableModel.findOne({ branch, semester });
//     if (!timetable) {
//       return res.status(200).json({ message: "Timetable not found" });
//     }
//     res.status(200).json(timetable);
//   } catch (err) {
//     console.error("Error while fetching timetable:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// }

export {
    saveTimetableController,
    getTimetableController,
    deleteTimetableController,
    updateTimetableController,
}