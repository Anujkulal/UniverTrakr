import MarksModel from "../../models/other/marksModel.js";

const addOrUpdateMarksController = async (req, res) => {
    try {
        const { enrollmentNo, subject } = req.body;
        // Find marks by enrollmentNo and subject (assuming subject is unique per student)
        const exists = await MarksModel.findOne({ enrollmentNo, subject });

        if (exists) {
            // Update existing marks
            const updated = await MarksModel.findOneAndUpdate(
                { enrollmentNo, subject },
                { $set: { ...req.body } },
                { new: true }
            );
            return res.status(200).json({ message: "Marks updated successfully", marks: updated });
        } else {
            // Create new marks
            const newMarks = new MarksModel({ ...req.body });
            await newMarks.save();
            return res.status(201).json({ message: "Marks added successfully", marks: newMarks });
        }
    } catch (error) {
        console.error("Error adding/updating marks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getMarksByEnrollmentNoController = async (req, res) => {
    try {
        const { enrollmentNo, subject } = req.params;
        const marks = await MarksModel.findOne({ enrollmentNo, subject });

        if (!marks) {
            // No error, just indicate marks not present
            return res.status(200).json({ message: "No marks found for this enrollment number and subject.", marks: null });
        }

        return res.status(200).json({ message: "Marks found", marks });
    } catch (error) {
        console.error("Error fetching marks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { 
    addOrUpdateMarksController,
    getMarksByEnrollmentNoController,
 };