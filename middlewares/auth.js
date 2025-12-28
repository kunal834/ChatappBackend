import { Usermodel } from "../models/User.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async( req ,res , next) =>{
     try{
    const token = req.cookies.authtoken;
   console.log(token)

    if(!token){
     res.status(400).json({     
          success: false,
          message: "login first"
     })
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET);
    console.log(decoded);


   const user = await Usermodel.findById(decoded._id).select("-password"); // Security purpose so that password may not come to frontend 

console.log(user)
   if(!user) return res.json({success: false, message: "User not found"});

   req.user = user;  // it will attach id to go to profileupdate 
   

   next();


     }catch(error){
    
        res.status(404).json({success: false, message: "Invalid Token"});
     }
}

