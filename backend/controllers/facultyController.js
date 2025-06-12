import bcrypt from "bcryptjs"
import UserModel from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import FacultyModel from "../models/facultyModel.js";

const facultyRegisterController = async (req, res) => {
    try{
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "Faculty already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      userId,
      password: hashedPassword,
      role: "Faculty",
    });
    await newUser.save();

    return res.status(201).json({
      message: "Faculty registered successfully",
      user: {
        _id: newUser._id,
        userId: newUser.userId,
        role: newUser.role,
      },
    });
    } catch(error){
        console.error("Error registering faculty:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const facultyLoginController = async (req, res) => {
    try{
        const { userId, password } = req.body;
        if (!userId || !password) {
          return res.status(400).json({ message: "All fields are required" });
        }
    
        const user = await UserModel.findOne({ userId });
        //find user
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }
    
        //check role
        if (user.role !== "Faculty") {
          return res.status(403).json({ message: "Access denied: Not an Faculty" });
        }
    
        //compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        // console.log("compare password", isValidPassword);
        
        if (isValidPassword) {
          const token = createToken(res, user._id);
          // console.log("token", token);
          return res
            .status(201)
            .json({ message: "Faculty logged in successfully", token, user: {_id: user._id, userId: user.userId, role: user.role} });
        }
        else{
            return res.status(400).json({message: "Invalid credentials"});
        }
    } catch(error){
        console.error("Error logging in faculty:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const facultyLogoutController = async (req, res) => {
    try {
    const cookie = req.cookies.jwt;

    if(!cookie) {
      return res.status(400).json({ message: "User not logged in" });
    }
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(200).json({ message: "Faculty logged out successfully" });
  }
  catch (error) {
    console.error("Faculty logout error:", error);
    res.status(500).json({ message: "Server error" });
  }  
}

const updateFacultyLoggedInPasswordController = async (req, res) => {
  try{
    const {currentPassword, newPassword} = req.body;
    const {userId} = req.user;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ userId });
    if(!user){
        return res.status(400).json({ message: "Faculty not found" });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if(!isValidPassword){
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await UserModel.findOneAndUpdate({ userId }, { password: hashedPassword }, { new: true });
    return res.status(200).json({ message: "Password updated successfully" });
  }catch(error){
    console.error("Error updating faculty password:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const updateSelectedFacultyPasswordController = async (req, res) => {
  try{
    const {newPassword} = req.body;
    const {userId} = req.params;

    if(req.user.role !== "Admin"){
      return res.status(403).json({message: "Access denied"});
    }
    if(!newPassword){
      return res.status(400).json({message: "All fields are required"});
    }
    const user = await UserModel.findOne({userId: userId});
    if(!user || user.role !== "Faculty"){
      return res.status(404).json({message: "Faculty not found"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await UserModel.findOneAndUpdate({userId}, {password: hashedPassword}, {new: true});
    if(!updatedUser){
      return res.status(404).json({message: "Faculty not found"});
    }

    return res.status(200).json({message: "Password updated successfully"});
  } catch(error){
    console.error("Error while updating faculty password:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const addFacultyDetailsController = async (req, res) => {
  try{
    const existingUserId = await FacultyModel.findOne({
      facultyId: req.body.facultyId,
    }); 

    const existingUserEmail = await FacultyModel.findOne({
      email: req.body.email,
    })

    if (existingUserId) {
      return res
        .status(400)
        .json({ message: "Faculty Already Exists with this ID" });
    }
    if (existingUserEmail) {
      return res
        .status(400)
        .json({ message: "Faculty Already Exists with this Email" });
    }

    const profileImage = req.file ? req.file.filename : undefined;
    
    const newUser = new FacultyModel({
      ...req.body,
      ...(profileImage && { profile: profileImage }),
    });

    await newUser.save();

    return res.status(201).json({
      message: "Faculty added successfully",
      newUser,
    });
  }catch(error){
    console.error("Error adding Faculty:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const addMultipleFacultyController = async (req, res) => {
  const { faculties } = req.body;
  try {
    // Validate input
    if (!faculties || !Array.isArray(faculties) || faculties.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid faculty data" });
    }

    // Filter out invalid Faculty (missing required fields)
    const validFaculties = faculties.filter(
      faculty =>
        faculty.facultyId &&
        faculty.facultyId.trim() !== "" &&
        faculty.email &&
        faculty.email.trim() !== ""
    );


    if (validFaculties.length === 0) {
      return res.status(400).json({ success: false, message: "No valid faculty data provided" });
    }

    // Check for duplicates in DB
    const facultyIds = validFaculties.map(s => s.facultyId); // array of ids
    const emails = validFaculties.map(s => s.email);

    const existingFaculties = await FacultyModel.find({
      $or: [
        { facultyId: { $in: facultyIds } },
        { email: { $in: emails } }
      ]
    });

    if (existingFaculties.length > 0) {
      const duplicateNos = existingFaculties.map(s => s.facultyId);
      const duplicateEmails = existingFaculties.map(s => s.email);
      return res.status(409).json({
        success: false,
        message: `Duplicate faculties found. facultyIds: [${duplicateNos.join(", ")}], Emails: [${duplicateEmails.join(", ")}]`
      });
    }

    // Insert Faculty details
    const insertedFaculties = await FacultyModel.insertMany(validFaculties);

    // Create Faculty credentials (password = facultyId)
    const credentials = await Promise.all(
      validFaculties.map(async faculty => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(faculty.facultyId, salt);
        return {
          userId: faculty.facultyId,
          password: hashedPassword,
          role: "Faculty"
        };
      })
    );

    await UserModel.insertMany(credentials);

    res.json({ success: true, message: "Faculties added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllFacultyDetailsController = async (req, res) => {
  try{
    const faculties = await FacultyModel.find({});
    // console.log("Faculties:", faculties);

    return res.status(200).json({
      message: faculties.length > 0 ? "Faculties found" : "No Faculty found", faculties
    });
  } catch(error){
    console.error("Error while fetching all faculty details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getFacultyByIdDetailsController = async (req, res) => {
  try{
    const {facultyId} = req.params;
    const user = await FacultyModel.findOne({facultyId})

    if (!user) {
      return res.status(200).json({ message: "Faculty not found" });
    }

    res.status(200).json({ user });
  }catch(error){
    console.error("Error while fetching faculty details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getFacultyMyDetailsController = async (req, res) => { // for profile
  try{
    const user = await FacultyModel.findOne({facultyId: req.user.userId})
    if(!user){
      return res.status(200).json({message: "User not found"})
    }

    return res.status(200).json({message: "User found", user})
  } catch(error){
    console.error("Error while fetching faculty details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateFacultyDetailsController = async (req, res) => {
  try {
    const facultyId = req.params.facultyId;
    const updates = {...req.body};

    if(req.file){
      updates.profile = req.file.filename;
    }

    const updatedFaculty = await FacultyModel.findOneAndUpdate({facultyId}, {$set: updates}, {new: true})
    if(!updatedFaculty){
      return res.status(404).json({message: "Faculty not found"});
    }
    return res.status(200).json({message: "Faculty details updated successfully", faculty: updatedFaculty});
  } catch (error) {
    console.error("Error while updating faculty details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteFacultyController = async (req, res) => {
  try {
    const facultyId = req.params.facultyId;
    const deletedFaculty = await FacultyModel.findOneAndDelete({facultyId}, { new: true });
    // console.log("Deleted Faculty:", deletedFaculty);
    if (!deletedFaculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    await UserModel.findOneAndDelete({ userId: deletedFaculty.facultyId });
    return res.status(200).json({ message: "Faculty deleted successfully", faculty: deletedFaculty });
  } catch (error) {
    console.error("Error while deleting Faculty:", error);
    res.status(500).json({ message: "Server error" }); 
  }
}

export {
    facultyRegisterController,
    facultyLoginController,
    facultyLogoutController,
    updateFacultyLoggedInPasswordController,
    updateSelectedFacultyPasswordController,
    addFacultyDetailsController,
    addMultipleFacultyController,
    getAllFacultyDetailsController,
    getFacultyByIdDetailsController,
    getFacultyMyDetailsController,
    updateFacultyDetailsController,
    deleteFacultyController,
}