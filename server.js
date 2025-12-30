import express from "express";
import cors from "cors";
import http from "http";
import "dotenv/config";
import { config } from "dotenv";
import { connectdb } from "./lib/db.js";
import{ errormiddleware} from "./middlewares/error.js"
import userrouter from "./routes/userrouter.js"
import cookieparser from "cookie-parser"
import messagerouter from "./routes/messagerouter.js"

import { Server } from "socket.io";



// Create Express app and HTTP server
const app = express();
const port = 5000;
const server = http.createServer(app);

// Initialize socket.io server
export  const io = new Server(server , {
    cors: {origin: process.env.FRONTEND_URL},
    methods: ["GET", "POST" ,"PUT" ,"DELETE"],
    credentials: true,
  

})

//Store online users
export const userSocketMap = {} // {userId : socketId}

if(process.env.NODE_ENV != "Production"){
config({
    path:"./.env",
})
}

// Socket.io connection handler function
io.on("connection" , (socket) =>{
  
    const userId = socket.handshake.query.userId;
    console.log(userId)
    console.log("user Connected" , userId);
    
    // Store the mapping of userId to socketId
    if(userId) userSocketMap[userId] = socket.id;

    // Emit online users to all connected clients
    io.emit("getOnlineUsers" , Object.keys(userSocketMap)); // Send list of online userIds to all  Frontend for green dot   

    socket.on("disconnect" , () =>{
       console.log("User disconnected", userId);

        // Only remove the user if the disconnecting socket matches the stored socket
        // This prevents closing Tab 1 from logging out Tab 2
        if (userSocketMap[userId] === socket.id) {
            delete userSocketMap[userId];
            // Only emit the update if we actually removed someone
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
        


    })       
    


})



// middleware setip
app.use(express.json({limit: "4mb"}))  // so that we can upload image of max 4 mb limit 
// Express Backend Connection Code
app.use(cors({
  origin: process.env.FRONTEND_URL, // Exact URL of your React app
  credentials: true    ,
    methods: ["GET", "POST" ,"PUT" ,"DELETE"]  
            // Allow cookies/tokens
}));
app.use(cookieparser())



app.get("/" , (req, res)=>{
    res.json({
        message : "hello server started",
    })
})

app.use("/api/users" , userrouter);
app.use("/api/message", messagerouter);


await connectdb();

server.listen(port, () =>{
    console.log(`server is hosting on ${port}`)
})


// Errorhandler
app.use(errormiddleware)


// server object because that is the single object binding your Express application and your Socket.io logic together.