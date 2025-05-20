import bcrypt from "bcryptjs";
import UserModel from "../models/userModel.js";
import createToken from "../utils/createToken.js";
import AdminModel from "../models/adminModel.js";

const adminRegisterController = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUserId = await UserModel.findOne({ userId });
    if (existingUserId) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      userId,
      password: hashedPassword,
      role: "Admin",
    });
    await newUser.save();

    return res.status(201).json({
      message: "Admin registered successfully",
      user: {
        _id: newUser._id,
        userId: newUser.userId,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const adminLoginController = async (req, res) => {
  try {
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
    if (user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    //compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    // console.log("compare password", isValidPassword);

    if (isValidPassword) {
      const token = createToken(res, user._id);
      // console.log("token", token);
      return res
        .status(201)
        .json({
          message: "Admin logged in successfully",
          token,
          user: { _id: user._id, userId: user.userId, role: user.role },
        });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const adminLogoutController = async (req, res) => {
  try {
    const cookie = req.cookies.jwt;

    if (!cookie) {
      return res.status(400).json({ message: "User not logged in" });
    }

    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateAdminLoggedInPasswordController = async (req, res) => {
  try{
    const {currentPassword, newPassword} = req.body;
    const {userId} = req.user;
    if(!currentPassword || !newPassword){
      return res.status(400).json({message: "All fields are required"});
    }

    const user = await UserModel.findOne({userId: userId});
    if(!user){
      return res.status(404).json({message: "Admin not found"});
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if(!isValidPassword){
      return res.status(400).json({message: "Invalid credentials"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await UserModel.findOneAndUpdate({userId}, {password: hashedPassword}, {new: true});
    if(!updatedUser){
      return res.status(404).json({message: "Admin not found"});
    }

    return res.status(200).json({message: "Password updated successfully"});
  } catch(error){
    console.error("Error while updating admin password:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const updateSelectedAdminPasswordController = async (req, res) => {
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

    if(!user || user.role !== "Admin"){
      return res.status(404).json({message: "Admin not found"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await UserModel.findOneAndUpdate({userId}, {password: hashedPassword}, {new: true});

    if(!updatedUser){
      return res.status(404).json({message: "Admin not found"});
    }

    return res.status(200).json({message: "Password updated successfully"});
  } catch(error){
    console.error("Error while updating admin password:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const addAdminDetailsController = async (req, res) => {
  try {
    const existingUserId = await AdminModel.findOne({
      adminId: req.body.adminId,
    });
    const existingUserEmail = await AdminModel.findOne({
      email: req.body.email,
    });
    if (existingUserId) {
      return res
        .status(400)
        .json({ message: "Admin Already Exists with this ID" });
    }
    if (existingUserEmail) {
      return res
        .status(400)
        .json({ message: "Admin Already Exists with this Email" });
    }

    const profileImage = req.file ? req.file.filename : undefined;

    const newUser = new AdminModel({
      ...req.body,
      ...(profileImage && { profile: profileImage }),
    });

    await newUser.save();

    return res.status(201).json({
      message: "Admin added successfully",
      newUser,
    });
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllAdminDetailsController = async (req, res) => {
  try{
    const admins = await AdminModel.find({});
    if(!admins){
      return res.status(404).json({message: "Admins not found"})
    }
    return res.status(200).json({message: "Admins found", admins});
  } catch(error){
    console.error("Error while fetching all admin details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAdminByIdDetailsController = async (req, res) => {
  try{
    const {adminId} = req.body;
    const user = await AdminModel.findOne({adminId})

    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ user });
  }catch(error){
    console.error("Error while fetching admin details:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const getMyDetailsController = async (req, res) => {
  try{        
    const user = await AdminModel.findOne({adminId: req.user.userId});
    if(!user){
      return res.status(404).json({message: "User not found"})
    }

    return res.status(200).json({message: "User found", user})
  }
  catch(error){
    console.error("Error while fetching admin details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateAdminDetailsController = async (req, res) => {
  try{
    const adminId = req.params.adminId;
    const updates = {...req.body};

    // for(const key in req.body){
    //   if(req.body[key]){
    //     updates[key] = req.body[key];
    //   }
    // }
    
    if(req.file){
      updates.profile = req.file.filename;
    }    

    const updatedAdmin = await AdminModel.findOneAndUpdate({adminId}, {$set: updates}, {new: true});

    if(!updatedAdmin){
      return res.status(404).json({message: "Admin not found"});
    }

    return res.status(200).json({message: "Admin details updated successfully", admin: updatedAdmin});
  }
  catch(error){
    console.error("Error while updating admin details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  adminLoginController,
  adminRegisterController,
  adminLogoutController,
  updateAdminLoggedInPasswordController,
  updateSelectedAdminPasswordController,
  addAdminDetailsController,
  getAllAdminDetailsController,
  getAdminByIdDetailsController,
  getMyDetailsController,
  updateAdminDetailsController,
};
