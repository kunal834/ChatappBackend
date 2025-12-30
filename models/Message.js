import mongoose from "mongoose";




const messagechema = mongoose.Schema({
   SenderId : { type: mongoose.Schema.Types.ObjectId , ref : "usersmodels" , require: true},
   RecieverId: { 
       type: mongoose.Schema.Types.ObjectId, // changed from String to ObjectId
       ref: "usersmodels", // ADDED THIS
       required: true 
   },
   text : { type : String},
   image: {type : String},
   seen : { type : Boolean ,  default : false}

} , {timestamps: true})

export const Messagemodel = mongoose.model("messagemodel" , messagechema);

