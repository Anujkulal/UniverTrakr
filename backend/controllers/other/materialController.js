import MaterialModel from "../../models/other/materialModel.js";

const addMaterialController = async (req, res) => {
    try {
        const newMaterial = new MaterialModel({
            faculty: req.body.faculty,
            branch: req.body.branch,
            subject: req.body.subject,
            title: req.body.title,
            file: req.file.filename
        })
        await newMaterial.save();
        res.status(201).json({ message: "Material added successfully", material: newMaterial });
    } catch (error) {
        console.error("Error while adding material:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getMaterialController = async (req, res) => {
    try {
        const { branchCode, subject } = req.params;
        const materials = await MaterialModel.find({ branch: branchCode });
        if (!materials || materials.length === 0) {
            return res.status(404).json({ message: "No materials found for this branch and subject." });
        }
        res.status(200).json({ message: "Materials found", materials });
    }
    catch (error) {
        console.error("Error while fetching materials:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {
    addMaterialController,
    getMaterialController,
}