// libraries
const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./src/config/db");
const indexRoute = require("./src/routes/inndexRoute");
// const {Client, Client} = require("pg");

// using the libraries
const app = express();
dotenv.config();

// calling the controllers
app.use(express.json());


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

app.use('/index',indexRoute);



// function calling starting the server
app.listen(process.env.PORT,function(error){
    if(error){
        console.error(error);
    }
    else{
    console.log("Server is running on port",process.env.PORT)}});

// module.exports={app};