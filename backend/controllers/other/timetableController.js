import TimetableModel from "../../models/other/timetableModel.js";

const saveTimetableController = async (req, res) => {
  try {
    const { branch, semester, timings, data } = req.body;
    const timetable = new TimetableModel({ branch, semester, timings, data });
    await timetable.save();
    res.status(201).json({ message: 'Timetable saved', timetable });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTimetableController = async (req, res) => {
  try {
    const timetables = await TimetableModel.find();
    res.status(200).json(timetables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export {
    saveTimetableController,
    getTimetableController,
}