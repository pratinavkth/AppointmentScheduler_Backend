const ApiError = require("../utils/ApiError")
const Messages = require("../models/chatModel");

const connectedUser ={};

exports.chatController= async(io,socket)=>{
    socket.on("register",(userId)=>{
        connectedUser[userId] = socket.id;
        console.log(`${userId} connected with socket ${socket.id}`);
    })

    socket.on("sendmessage",async({senderId,receiverId,message})=>{
        const msg  = await Messages.create({
            sendBy:senderId,
            sendTo:receiverId,
            decryptedMessage:message
            
        });
         const receiverSocketId = connectedUsers[receiverId];
         if(receiverSocketId){
                io.to(receiverSocketId).emit("receiveMessage", msg);
         }
    })
}

// module.exports = chatController;