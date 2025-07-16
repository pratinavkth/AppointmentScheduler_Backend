const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./src/config/db");
const indexRoute = require("./src/routes/inndexRoute");
const routingoauthcontroller = require("./src/controllers/oauthController");
const http = require("http");
const {Server} = require("socket.io");
const Socketmiddelware = require("./src/middelwares/socketcheck");
const { chatController } = require("./src/controllers/chat_controller");

// using the libraries
dotenv.config();
const app = express();
app.use(express.json());


const servers = http.createServer(app);
const io = new Server(servers,{
  cors:{
    origin:'*',
    methods:["GET","POST"],
  }
});
io.use(Socketmiddelware);

io.on("connection",(socket)=>{
  chatController(io,socket);
});

// calling the controllers


(async ()=>{try{
    const result = await sequelize.query('SELECT NOW()');
    console.log('NeonDB connected successfully! Server time:', result[0][0].now);
}catch(e){

    console.error("There is the issue while connecting the db",error);
    process.exit(1);
}});

sequelize.sync({alter:true})
  .then(()=>{
    console.log("Table Synced Successfully");
  })
  .catch((err)=>{
    console.error("THere is issue while connecting it",err);
  })

app.get('/redirect',routingoauthcontroller.googleCallback);

app.use('/index',indexRoute);



// function calling starting the server
servers.listen(process.env.PORT,function(error){
    if(error){
        console.error(error);
    }
    else{
    console.log("Server is running on port",process.env.PORT)}});

