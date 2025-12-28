import mongoose from "mongoose";

export const connectdb = async() =>{
    try{
        mongoose.connection.on('connected' , () =>
            console.log("Mongodb Connected")
    )
    await  mongoose.connect(process.env.MONGO_URI , {
        dbName :"Chatapp"
      })

    }catch(error){

        console.log(error);

    }

}