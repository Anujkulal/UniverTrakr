import SubjectModel from "../../models/other/subjectModel.js";

const addSubjectController = async (req, res) => {
    try {
        const {name, code} = req.body;
        if(!name || !code){
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingSubject = await SubjectModel.findOne({
            $or: [{name}, {code}]
        })
        console.log("existingSubject", existingSubject);

        // Check if Subject with same name or code already exists
        if(existingSubject){
            return res.status(400).json({ message: "Subject already exists" });
        }

        const newSubject = new SubjectModel({ name, code });
        await newSubject.save();

        return res.status(201).json({
      message: "Subject added successfully",
      subject: newSubject,
    });
    } catch (error) {
        console.error("Error while adding subject:", error);
    res.status(500).json({ message: "Server error" });
    }
}

const getAllSubjectController = async (req, res) => {
    try {
        const subject = await SubjectModel.find({});
        if(!subject){
            return res.status(404).json({message: "Subject not found"})
        }
        return res.status(200).json({message: "Subject found", subject});
  } catch(error){
    console.error("Error while fetching subject:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const removeSubjectController = async (req, res) => {
    try {
        const { subjectCode } = req.params;
        const subject = await SubjectModel.findOneAndDelete({ code: subjectCode });
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }
        return res.status(200).json({ message: "Subject removed successfully" });
    } catch (error) {
        console.error("Error while removing subject:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export {
    addSubjectController,
    getAllSubjectController,
    removeSubjectController,
}