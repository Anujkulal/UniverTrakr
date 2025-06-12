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
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const NoticeModel = mongoose.model("Notice", NoticeSchema)

export default NoticeModel;