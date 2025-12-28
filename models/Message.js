import mongoose from "mongoose";




const messagechema = mongoose.Schema({
   SenderId : { type: mongoose.Schema.Types.ObjectId , ref : "usersmodels" , require: true},
   RecieverId: { type: String },
   text : { type : String},
   image: {type : String},
   seen : { type : Boolean ,  default : false}

} , {timestamps: true})

export const Messagemodel = mongoose.model("messagemodel" , messagechema);

