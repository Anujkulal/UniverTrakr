import BranchModel from "../../models/other/branchModel.js";

const addBranchController = async (req, res) => {
    try {
        const {name, code} = req.body;
        if(!name || !code){
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingBranchName = await BranchModel.findOne({name});
        const existingBranchCode = await BranchModel.findOne({code});
        // console.log("existingBranch", existingBranchCode);
        // Check if branch with same name or code already exists
        if(existingBranchName || existingBranchCode){
            return res.status(400).json({ message: "Branch already exists" });
        }

        const newBranch = new BranchModel({ name, code });
        await newBranch.save();

        return res.status(201).json({
      message: "Branch added successfully",
      branch: newBranch,
    });
    } catch (error) {
        console.error("Error while adding branch:", error);
    res.status(500).json({ message: "Server error" });
    }
}

const getAllBranchController = async (req, res) => {
    try {
        const branch = await BranchModel.find({});
        if(!branch){
            return res.status(404).json({message: "Branch not found"})
        }
        return res.status(200).json({message: "Branch found", branch});
  } catch(error){
    console.error("Error while fetching branch:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const removeBranchController = async (req, res) => {
    try {
        const { branchCode } = req.params;
        const branch = await BranchModel.findOneAndDelete({ code: branchCode });
        if (!branch) {
            return res.status(404).json({ message: "Branch not found" });
        }
        return res.status(200).json({ message: "Branch removed successfully" });
    } catch (error) {
        console.error("Error while removing branch:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export {
    addBranchController,
    getAllBranchController,
    removeBranchController,
}