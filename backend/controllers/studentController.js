import bcrypt from "bcryptjs"
import UserModel from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import StudentModel from "../models/studentModel.js";

const studentRegisterController = async (req, res) => {
    try{
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      userId,
      password: hashedPassword,
      role: "Student",
    });
    await newUser.save();

    return res.status(201).json({
      message: "Student registered successfully",
      user: {
        _id: newUser._id,
        userId: newUser.userId,
        role: newUser.role,
      },
    });
    } catch(error){
        console.error("Error registering student:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const studentLoginController = async (req, res) => {
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
        if (user.role !== "Student") {
          return res.status(403).json({ message: "Access denied: Not a Student" });
        }
    
        //compare password
        const isValidPassword = await bcrypt.compare(password, user.password);
        // console.log("compare password", isValidPassword);
        
        if (isValidPassword) {
          const token = createToken(res, user._id);
          // console.log("token", token);
          return res
            .status(201)
            .json({ message: "Student logged in successfully", token, user: {_id: user._id, userId: user.userId, role: user.role} });
        }
        else{
            return res.status(400).json({message: "Invalid credentials"});
        }
    } catch(error){
        console.error("Error logging in student:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const studentLogoutController = async (req, res) => {
    try {
    const cookie = req.cookies.jwt;

    if(!cookie) {
      return res.status(400).json({ message: "User not logged in" });
    }
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(200).json({ message: "Student logged out successfully" });
  }
  catch (error) {
    console.error("Student logout error:", error);
    res.status(500).json({ message: "Server error" });
  }  
}

const updateStudentLoggedInPasswordController = async (req, res) => {
  try{
    const {currentPassword, newPassword} = req.body;
    const {userId} = req.user;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({ userId });
    if(!user){
        return res.status(400).json({ message: "Student not found" });
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
    console.error("Error updating student password:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const updateSelectedStudentPasswordController = async (req, res) => {
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
    if(!user || user.role !== "Student"){
      return res.status(404).json({message: "Student not found"});
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await UserModel.findOneAndUpdate({userId}, {password: hashedPassword}, {new: true});
    if(!updatedUser){
      return res.status(404).json({message: "Student not found"});
    }

    return res.status(200).json({message: "Password updated successfully"});
  } catch(error){
    console.error("Error while updating student password:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const addStudentDetailsController = async (req, res) => {
  try{
    const existingUserId = await StudentModel.findOne({
      enrollmentNo: req.body.enrollmentNo,
    }); 

    const existingUserEmail = await StudentModel.findOne({
      email: req.body.email,
    })

    if (existingUserId) {
      return res
        .status(400)
        .json({ message: "Student Already Exists with this ID" });
    }
    if (existingUserEmail) {
      return res
        .status(400)
        .json({ message: "Student Already Exists with this Email" });
    }

    const profileImage = req.file ? req.file.filename : undefined;
    
    const newUser = new StudentModel({
      ...req.body,
      ...(profileImage && { profile: profileImage }),
    });

    await newUser.save();

    return res.status(201).json({
      message: "Student added successfully",
      newUser,
    });
  }catch(error){
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const deleteStudentController = async (req, res) => {}

export {
    studentRegisterController,
    studentLoginController,
    studentLogoutController,
    updateStudentLoggedInPasswordController,
    updateSelectedStudentPasswordController,
    addStudentDetailsController,
}