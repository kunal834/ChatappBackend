import mongoose from "mongoose";


const userschema = mongoose.Schema({
     fullname : String,
     email : {
        type : String,
        required : true,
        unique : true
     },
     password : {
        type: String ,
        required : true,
        minlength : 6

     },
     profilePic: {
        type: String ,
        default: " ",

     },
     bio : {
        type: String
     }
} , {timestamps: true})

export const Usermodel = mongoose.model("usersmodel" , userschema);

