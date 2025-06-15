import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "./media");
    let folder = "media";

    if (req.body?.adminId) {
      folder = "media/admin";
    } else if (req.body?.facultyId) {
      folder = "media/faculty";
    } else if (req.body?.enrollmentNo) {
      folder = "media/student";
    }
    else if (file.fieldname === "material") {
      folder = "media/material";
    }

    fs.mkdirSync(folder, {recursive: true});
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    let filename = "";

    // console.log("File fieldname:", file.fieldname);

    if (req.body?.adminId) {
      filename = `admin_profile_${req.body.adminId}.png`;
    } else if (req.body?.facultyId) {
      filename = `faculty_profile_${req.body.facultyId}.png`;
    } else if (req.body?.enrollmentNo) {
      filename = `student_profile_${req.body.enrollmentNo}.png`;
    }

    if(file.fieldname === "material"){
      filename = `${req.body.title}_Subject_${req.body.subject}.pdf`;
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
