import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true })

const BranchModel = mongoose.model("Branch", BranchSchema);
export default BranchModel;