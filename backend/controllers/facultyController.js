import bcrypt from "bcryptjs"
import UserModel from "../models/userModel.js";
import createToken from "../utils/createToken.js";

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

export {
    facultyRegisterController,
    facultyLoginController,
    facultyLogoutController,
}