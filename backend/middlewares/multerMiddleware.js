import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./media");
    },
    filename: function (req, file, cb) {
        let filename = "";
        // console.log("req.body:::", req.body);
        // if (req.body?.type === "timetable"){
        //     filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}.png`;
        // }
        // else if (req.body?.type === "profile"){
            if(req.body?.adminId){
                filename = `Admin_profile_${req.body.adminId}.png`;
            }
            else if(req.body?.facultyId){
                filename = `Faculty_profile_${req.body.facultyId}.png`;
            }
            else if(req.body?.enrollmentNo){
                filename = `Student_profile_${req.body.enrollmentNo}.png`;
            }
        // }
        // else if (req.body?.type === "material") {
        //     filename = `${req.body.title}_Subject_${req.body.subject}.pdf`
        // }

        filename = filename || `file_${Date.now()}.png`;

        cb(null, `${filename}`);
    }
});

const upload = multer({ storage: storage })

export default upload;