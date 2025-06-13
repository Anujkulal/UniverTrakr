import mongoose from "mongoose";

const NoticeSchema = new mongoose.Schema({
    link: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    branch: {
        type: [String], // Array of branches
    },
    role: {
        type: String, // Array of roles
        enum: ["All", "Faculty", "Student"],
        default: ["All"],
    },
}, {timestamps: true});

const NoticeModel = mongoose.model("Notice", NoticeSchema)

export default NoticeModel;