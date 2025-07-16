const {DataTypes} = require("sequelize");

const Sequelize = require("../config/db");

const Messages = Sequelize.define("Chats",{
    sendBy:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    sendTo:{
        type:DataTypes.UUID,
        allowNull:false,
    },
    decryptedMessage:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    encryptedMessage:{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    messageType:{
        type:DataTypes.TEXT,
        allowNull:false,
        defaultValue:'text',
    },
    timeStamp:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW,
    },
    meesageIsRead:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    }





});
module.exports =Messages;