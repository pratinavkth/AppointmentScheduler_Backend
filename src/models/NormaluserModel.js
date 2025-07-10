const {DataTypes } =require("sequelize");
const sequelize = require("../config/db");

const NormalUser = sequelize.define("NormalUser",{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull:false,
        primaryKey:true,
    },
    username:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    useremail:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    phonenumber:{
        type:DataTypes.BIGINT,
        allowNull:false,
    },
    datebooked:{
        type:DataTypes.DATEONLY,
        allowNull:false,
    },
    selectedService:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    userId:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    timeslot:{
        type:DataTypes.TIME,
        allowNull:false,
    },
});
module.exports = NormalUser;
