import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const authenticate = async (req, res, next) => {
    let token = req.cookies.jwt;
    // console.log("token:::", token);

    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log("decoded:::", decoded);
            req.user = await UserModel.findById(decoded._id).select("-password");
            next();
        } catch(error){
            res.status(401)
            res.json({message: "Not authorized, token failed"})
        }
    }
    else{
        res.status(401)
        res.json({message: "Not authorized, no token"})
    }
}

const roleOnly = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: "Access denied"})
        }
        next();
    }
}

export {
    authenticate,
    roleOnly,
}