
import bcrypt from "bcryptjs"
import ErrorHandler from "../utils/errorhandler.js"
import { Usermodel } from "../models/User.js"

import cloudinary from "../utils/Cloudinary.js"
import { sendcookie } from "../utils/Sendcookie.js"





export const Usersignup = async(req , res , next) =>{
    const {fullname , email , password ,bio} =  req.body

    try{
    if(!fullname || !email || !password || !bio){

     return next(new ErrorHandler("Incomplete Details" , 400))
    }

    const checkuser = await Usermodel.findOne({email});

    
        if(checkuser){
            return next(new ErrorHandler("User already exist" , 400))
        }
        

    const salt = await bcrypt.genSalt(10)  //genSalt is a function used to generate a "salt"—a random string of characters that is added to a password before it is hashed.Its primary purpose is to ensure that every password hash is unique, even if two users have the same password.
    const hashedpassword = await bcrypt.hash(password , salt);
    const newuser = await Usermodel.create({
        fullname,
        email,
        password: hashedpassword,
        bio


    })

    sendcookie(newuser , res , "Account created successfully", 200 )
  

    

    }catch(error){
         console.log("Error" ,error)
        res.status(500).json({
            success: false,
            message: error.message || "Internal Servor Error"
        })

    }


}

export const Userlogin = async(req,res,next) =>{
    const { email , password } = req.body;

    try{

        const newuser = await Usermodel.findOne({email})  // as we are sending newuser from sendcookie thats why we newuser
        if(!newuser){
            return next(new ErrorHandler("User not Registered" , 404))
    
        }

        const isPasswordcorrect = await bcrypt.compare(password , newuser.password)
        if(!isPasswordcorrect){
             return next(new ErrorHandler("Wrong Password" , 404))
        }
        
    
     sendcookie(newuser , res , "User login Successfully" ,  200);


    }catch(error){
         console.log("Error" ,error)
        res.status(500).json({
            success: false,
            message: error.message || "Internal Servor Error"
        })
    }


}

// Controller to check if user is Authenticated
export const checkAuth = (req,res) =>{
    res.json({
        success: true,
        user: req.user
    })
}

// controller so that user can update profile picture
export const Profileupdate = async(req,res) =>{
    try{
        const { fullname , bio , profilePic} = req.body;
        
        const userId = req.user._id;  // user will come from isAuthenticated middleware
        console.log("userId :" , userId)

        console.log("body:" , req.body)

        let updateduser ;

        if(!profilePic){
           updateduser = await Usermodel.findByIdAndUpdate(userId , {bio , fullname} , {new : true})
        }else{
            const upload = await cloudinary.uploader.upload(profilePic);
            updateduser = await Usermodel.findByIdAndUpdate(userId , {profilePic : upload.secure_url , bio , fullname} , {new: true})

        }
   
        res.json({
            success: true,
            user : updateduser
        })

    }catch(error){
    
        console.log("Error" ,error)
        res.status(500).json({
            success: false,
            message: error.message || "Internal Servor Error"
        })


    }

}

export const logout = (req ,res) =>{

    try{
        
        res.status(200).cookie("authtoken" ," ",
            {
                expires : new Date(Date.now()) , 
                
            }
        ).json({
            success : true,
            message: "logout successfully"
        })
    }catch(error){
        res.status(500).json({
            success : false,
            message: error.message || "Internal Server Error"
        })
    }

}

