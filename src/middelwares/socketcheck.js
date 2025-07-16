
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");


const Socketmiddelware = (socket,next)=>{
    const token = socket.handshake.auth?.token;
    if(!token){
        return next(new ApiError(400,"TOken is not valid"));
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        socket.user = decoded;
        next();
    } catch (error) {
        return next(new ApiError(500,"Error while authchecking sockets",error));
        
    }
};

module.exports = Socketmiddelware;