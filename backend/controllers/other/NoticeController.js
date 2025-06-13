import NoticeModel from "../../models/other/noticeModel.js";

const AddNoticeController = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }
        const newNotice = new NoticeModel(req.body);
        await newNotice.save();
        return res.status(201).json({
            message: "Notice added successfully",
            notice: newNotice,
        });
    } catch (error) {
        console.error("Error while adding notice:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const GetAllNoticesController = async (req, res) => {
    try {
        const notices = await NoticeModel.find({});
        if (!notices || notices.length === 0) {
            return res.status(404).json({ message: "No notices found" });
        }
        return res.status(200).json({ message: "Notices found", notices });
    } catch (error) {
        console.error("Error while fetching notices:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const RemoveNoticeController = async (req, res) => {
    try {
        const { noticeId } = req.params;
        const notice = await NoticeModel.findByIdAndDelete({_id: noticeId});
        if (!notice) {
            return res.status(404).json({ message: "Notice not found" });
        }
        return res.status(200).json({ message: "Notice removed successfully" });
    } catch (error) {
        console.error("Error while removing notice:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export {
    AddNoticeController,
    GetAllNoticesController,
    RemoveNoticeController,
}