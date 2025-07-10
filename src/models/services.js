const {DataTypes, Model} = require("sequelize");
const sequelize = require("../config/db");

const Services = sequelize.define("Services",
    {
        id:{
            type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true
        
        },
        service_sub_category:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        description:{
            type:DataTypes.TEXT,
            // allowNull:false
        },
        category_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        // in minutes
        created_at:{
            type:DataTypes.DATE,
            defaultValue:DataTypes.NOW,

        },
        updated_at:{
            type:DataTypes.DATE,
            defaultValue:DataTypes.NOW
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: false 
        },
        data:{
            type:DataTypes.JSON,
        },

        
    },
    {
    timestamps: true,
    underscored: true,
    }

);
    Services.associate =(models)=>{
        Services.belongsTo(models.ServiceCategory,{ foreignKey: "category_id" });
        Services.belongsTo(models.User,{as:"creator",foreignKey:"created_by"});
    };

    module.exports = Services;