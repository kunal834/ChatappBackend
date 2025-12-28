import { Messagemodel } from "../models/Message.js";
import { Usermodel } from "../models/User.js";
import cloudinary from "../utils/Cloudinary.js";
import { io ,userSocketMap } from "../server.js";


// Get all users except the logged in user 
export const getuserforsidebar  = async(req ,res) =>{

    try{
        const userId = req.user._id;
        console.log("user ki id",userId)
        const filteredUsers = await Usermodel.find({_id : {$ne: userId}}).select("-password") // we will remove the loggedin user from all the message user 

        // Count number of messages not seen 

        const unseenMessage = {} 
        const promises = filteredUsers.map(async (user) =>{
            const messages = await Messagemodel.find({
                SenderId : user._id , 
                RecieverId: userId,
                seen : false
            })

            if(messages.length >0){
                unseenMessage[user._id] = messages.length;

            }
        })
        await Promise.all(promises);

        res.json({
            success : true,
            users: filteredUsers,
            unseenMessage

        })

    }catch(error){
        console.log(error.messsage);
            res.status(500).json({
            success : false,
            message : error.message


        })
        

    }
}


// Get all meassages for selected users 
export const getMessage = async (req,res) =>{
    try{
        console.log("Full URL:", req.originalUrl); 
    
    // 2. Log the params
    console.log("Params:", req.params);
   const { id : SelectedUserId } = req.params;
  
   const myId = req.user._id;
   console.log("myID is " , myId)
   const messages = await Messagemodel.find({
    $or: [
        {SenderId : myId , RecieverId : SelectedUserId},
        {SenderId : SelectedUserId, RecieverId: myId }
    ]
   })

   await Messagemodel.updateMany({SenderId : SelectedUserId , RecieverId : myId } ,{ seen:true})
    res.json({
      success: true,
      messages : messages
    

    })


    }catch(error){
        console.log(error.message)
        res.status(500).json({
            success : false,
            message:  "Internal server error" || error.message 
        })
    }

}

// api to mark message as seen using message id
export const markMessageSeen = async (req ,res) =>{
    try{
        const {id} = req.params;
     const check =   await Messagemodel.findByIdAndUpdate(id, {seen : true})

        res.status(200).json({
            success : true,
            check

        })

    }catch(error){

          console.log("Error" ,error)
        res.status(500).json({
            success: false,
            message: error.message || "Internal Servor Error"
        })

    }

}

// Send message to selected user 
export const sendMessage = async (req ,res) =>{
    try{
     const {text , image}  = req.body;
     const RecieverId = req.params.id;
     const SenderId = req.user._id;
     console.log("senderID" , SenderId)

     let imageUrl;
     if(image){
        const uploadresponse = await cloudinary.uploader.upload(image);  // we will get a response file consisting of url ,secure_url of thata image
        imageUrl = uploadresponse.secure_url;  
}

const newmessage = await Messagemodel.create({
    SenderId,
    RecieverId,
    text,
    image: imageUrl

})

// Emit the new Message to the receivers socket 
const recieverSocketId = userSocketMap[RecieverId];
if(recieverSocketId){
    io.to(recieverSocketId).emit("newMessage" , newmessage)
}

res.status(200).json({
    success: true,
    newmessage : newmessage

})

    }catch(error){

          console.log("Error" ,error)
        res.status(500).json({
            success: false,
            message: error.message || "Internal Servor Error"
        })

    }
}