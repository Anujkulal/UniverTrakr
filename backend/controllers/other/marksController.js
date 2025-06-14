import MarksModel from "../../models/other/marksModel.js";

const getMarksByEnrollmentNoController = async (req, res) => {
    try{
        const { branchCode } = req.params;
        const marks = await MarksModel.find({ branchCode });
        
        if (marks.length === 0) {
            return res.status(404).json({ message: "No marks found for this enrollment number" });
        }
        
        res.status(200).json(marks);
    }
    catch (error) {
        console.error("Error fetching marks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { getMarksByEnrollmentNoController };