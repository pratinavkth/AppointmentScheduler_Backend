// creating serviceProvide by admin like heartsurgeon ,barber and all
const { where } = require("sequelize");
const Services = require("../models/services");

exports.serviceProvideCreate = async(req,res)=>{
    try {
        const {service_sub_category,description,category_id} = req.body;
        const Created = new Date();
        const Updated = new Date();
        console.log("Data taken");
        const userId = req.user.id;
        console.log("userId",userId);
        const serviceExist = await Services.findOne({where:{service_sub_category,created_by:userId}});
        console.log("Data verified");
        if(serviceExist){
            return res.status(401).json({msg:"Service is Already Present"});
        }
        let newSevice = await Services.create({
            service_sub_category,
            description,
            category_id,
            created_by:userId
            // Updated,
        });
        // await newSevice.save();
        return res.status(200).json({msg:"Service Created Succesfully by ServiceProvider",data:newSevice});
    } catch (error) {
        return res.status(500).json({msg:"There is issue while creating the service",error})
        
    }
}

exports.deleteSubService = async(req,res)=>{
    try {
        const {serviceSubCategoryName} = req.body;
        // const {id} = req.params;
        const userId = req.user.id;
        const deletesubcategory = await Services.findOne({where:{service_sub_category:serviceSubCategoryName,created_by:userId}});
        if(!deletesubcategory){
            return res.status(401).json({msg:"There is no service with this name"})
        }
        await deletesubcategory.destroy();
        return res.status(200).json({msg:"Sub Category Deleted Succesfully"});
    } catch (error) {
        return res.status(500).json({msg:"Error occured while Deleting the Service",error});
        
    }
}

exports.updateSubService = async(req,res)=>{
    try {
        const userId = req.user.id;

        const {serviceSubCategoryName,description} =req.body;
        if(!serviceSubCategoryName &&!description ){
            return res.status(400).json({msg:"There need to be some argument to update"});
        }
        const service = await Services.findOne({ where: { created_by: userId } });
        if (!service) {
            return res.status(404).json({ msg: "Service not found or not authorized" });
        }
        const updateService = {
            Updated:Date.now(),
        };
        if(serviceSubCategoryName) updateService.serviceSubCategoryName = serviceSubCategoryName;
        if(description) updateService.description = description;

        // await Services.update(updateService,where:{});
        await Services.update(updateService, { where: { id: service.id } });
        return res.status(200).json({msg:"Sub Category Updated Succesfully"});


    } catch (error) {
        return res.status(500).json({msg:"Error Occured While Updating the Sub Service",error});
    }
}

exports.getallsubCategoryservice = async(req,res)=>{
    try {
        const allservices= await Services.findAll();
        return res.status(200).json({msg:"Sub Services Fetched Succesfully",data:allservices});
        
    } catch (error) {
        return res.status(500).json({msg:"Error occured WHile getting all subcategory ",error});
    }
}

exports.getslectedservicebyadmin = async(req,res)=>{
    try {
        const userId  = req.user.id;
        // const productId = "";
        const services =  await Services.findAll({where:{userId}});

        return res.status(200).json({msg:"Selected Services by Admin got Fetched",data:services});
    } catch (error) {
        return res.status(500).json({msg:"Error Occured While fetching all the services which are registered by ServiceProvider"});
    }
}

// module.exports =Services;