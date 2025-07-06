const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");


const ServicesbyProviders = sequelize.define("ServicebyProviders",
    {
        id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true,

        },
        serviceName:{
            type:DataTypes.STRING,
            allowNull:false,

        },
        Description:{
            type:DataTypes.STRING,
            allowNull:false,

        },
        price:{
            type:DataTypes.DECIMAL,
            allowNull:false,
        },
        Time:{
            type:DataTypes.TIME,
            allowNull:false
        },
        provider_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        service_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        Data:{
            type:DataTypes.JSON,
            allowNull:true,
        },
    },
);
ServicesbyProviders.associate =(models)=>{
    ServicesbyProviders.belongsTo(models.User, { as: "provider", foreignKey: "provider_id" });
    ServicesbyProviders.belongsTo(models.Services, { foreignKey: "service_id" });
}
module.exports =ServicesbyProviders;