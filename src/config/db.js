const dotenv = require("dotenv");
// const { Pool } = require("pg");
const {Sequelize} = require("sequelize"); 

dotenv.config();
const sequelize = new Sequelize(
    process.env.NANODB_CONNECT,{
        dialect:'postgres',
        dialectOptions:{
        ssl:{
        require:true,
        rejectUnauthorized:false,
    },
},
});

sequelize
   .query('SELECT NOW()')
   .then((res)=>{
    console.log('Connected to NeonDb! server Time :',res[0][0].now);
   })
   .catch((err)=>{
    console.error("Failed to Error",err);
   });


module.exports = sequelize;