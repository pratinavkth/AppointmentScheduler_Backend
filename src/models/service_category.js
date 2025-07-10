const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const ServiceCategory = sequelize.define("ServiceCategory",{
    id:{
        type:DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
    },
    service_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    description:{
        type:DataTypes.TEXT,
        allowNull:false
    },

    
});
ServiceCategory.associate = (models)=>{
    ServiceCategory.hasMany(models.Services,{foreignKey: "category_id"});
};
module.exports =ServiceCategory;