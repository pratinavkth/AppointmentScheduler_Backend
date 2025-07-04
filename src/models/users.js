const { DataTypes } = require("sequelize");
const sequelize = require("../config/db")

const User = sequelize.define('User',{
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull: false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    role:{
        type: DataTypes.ENUM("user", "admin"),
        default:"user",
    },
    isVerified:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
    refreshToken:{
      type:DataTypes.STRING,
    },
});

module.exports = User;