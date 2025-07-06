const ServiceCategory = require("../models/service_category");

exports.serviceCategoryCreate = async(req,res)=>{
    try {
        const {service_name,description }= req.body;
        const serviceExist = await ServiceCategory.findOne({where:{service_name}});
        if(serviceExist){
            return res.status(401).json({msg:"This service Already Exist"});
        }
        let createService = new ServiceCategory({
            service_name,
            description
        });
        await createService.save();
        return res.status(200).json({msg:"Service Created Successfully"});
    } catch (error) {
        return res.status(500).json({msg:"Issue Occured while Creating a service category",error});
    }
}

exports.deleteServiceCategory = async(req,res)=>{
    try {
        const {service_name} = req.body;
        const servicetodelete = await ServiceCategory.findOne({where:{service_name}});
        if(!servicetodelete){
            return res.status(401).json({msg:"This service is not available"});
        }
        await servicetodelete.destroy();
        

    } catch (error) {
        return res.status(500).json({msg:"Error Occured while Deleting the Service"})
    }
}

exports.updateServiceCategory = async(req,res)=>{
    try {
        const {service_name,description }= req.body;
        const {id} = req.params;
        if(!service_name && !description){
            return res.status(400).json({msg:"There need to be one argument to change it"});
        }

        const updatefields ={}; 

        if(service_name) updatefields.service_name = service_name;
        if(description) updatefields.description = description;

        const updated =  await ServiceCategory.update(
            updatefields,{
                where:{id}
            }

        );
        return res.status(200).json({msg:"Your Service Updated Succesfully"});
    } catch (error) {
        return res.status(500).json({msg:"Error while Updating the Service",error});
    }
}


exports.getServiceCategory = async(req,res)=>{
    try {
        await ServiceCategory.findAll();
        return res.status(200).json({msg:"Service Category  Fetched Succesfully"})
    } catch (error) {
        return res.status(500).json({msg:"Error while fetching all the Services",error});
    }
}