import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "./media");
    let folder = "media";

    if (req.body?.adminId || req.body?.userId) {
      folder = "media/admin";
    } else if (req.body?.facultyId) {
      folder = "media/faculty";
    } else if (req.body?.enrollmentNo) {
      folder = "media/student";
    }

    fs.mkdirSync(folder, {recursive: true});
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    let filename = "";
    // console.log("req.body:::", req.body);
    // if (req.body?.type === "timetable"){
    //     filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}.png`;
    // }
    // else if (req.body?.type === "profile"){
    if (req.body?.adminId || req.body?.userId) {
      filename = `admin_profile_${req.body.adminId || req.body?.userId}.png`;
    } else if (req.body?.facultyId) {
      filename = `faculty_profile_${req.body.facultyId}.png`;
    } else if (req.body?.enrollmentNo) {
      filename = `student_profile_${req.body.enrollmentNo}.png`;
    }
    // }
    // else if (req.body?.type === "material") {
    //     filename = `${req.body.title}_Subject_${req.body.subject}.pdf`
    // }

    filename = filename || `file_${Date.now()}.png`;

    cb(null, `${filename}`);
  },
});

const upload = multer({ storage: storage });

export default upload;
