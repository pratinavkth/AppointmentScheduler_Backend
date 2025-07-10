// created by services by admin
const ServiceCategory = require("../models/service_category");
const Services = require("../models/services");

exports.serviceCategoryCreate = async(req,res)=>{
    try {
        const {service_name,description }= req.body;
        const serviceExist = await ServiceCategory.findOne({where:{service_name}});
        if(serviceExist){
            return res.status(401).json({msg:"This service Already Exist"});
        }
        let createService = await ServiceCategory.create({
            service_name,
            description
        });
        // await createService.save();
        
        return res.status(200).json({msg:"Service Created Successfully",data:createService});
    } catch (error) {
        return res.status(500).json({msg:"Issue Occured while Creating a service category",error});
    }
}

exports.deleteServiceCategory = async(req,res)=>{
      console.log("deleteServiceCategory controller hit");

    try {
        console.log("taking the id");
        const {id} = req.body;
        console.log("This is here id",id);
        if (!id) {
            return res.status(400).json({ msg: "Service id is required" });
        }
        console.log("id is present");
        const servicetodelete = await ServiceCategory.findOne({where:{id}});
        if(!servicetodelete){
            return res.status(404).json({msg:"This service is not available"});
        }
        console.log("Service is not  ");
        const linkedServices = await Services.count({ where: { category_id: id } });
    if (linkedServices > 0) {
      return res.status(400).json({ msg: "Cannot delete category: services still exist under this category" });
    }
        await servicetodelete.destroy();
        return res.status(200).json({ msg: "Service category deleted successfully" });
        


    } catch (error) {
        // console.log(error);
        console.error("Error while deleting",error);
          if (error.name === 'SequelizeDatabaseError') {
            console.error("Database error:", error.message);
        }
        return res.status(500).json({msg:"Error Occured while Deleting the Serviceddd",error:error.message,
            error: error?.message || String(error) || "Unknown error",
            stack: error?.stack

        })
    }
}

exports.updateServiceCategory = async(req,res)=>{
    try {
        const {service_name,description,id }= req.body;
        console.log("Response taken");
        // const {id} = req.user.id;
        console.log("Response taken2for id");
        if(!service_name && !description){
            return res.status(400).json({msg:"There need to be one argument to change it"});
        }

        const updatefields ={}; 

        if(service_name) updatefields.service_name = service_name;
        if(description) updatefields.description = description;
        console.log("update to taken");

        const updated =  await ServiceCategory.update(
            updatefields,{
                where:{id}
            }

        );
        return res.status(200).json({msg:"Your Service Updated Succesfully",data:updated});
    } catch (error) {
        return res.status(500).json({msg:"Error while Updating the Service",error});
    }
}


exports.getServiceCategory = async(req,res)=>{
    try {
        const serviceCategories=await ServiceCategory.findAll();
        return res.status(200).json({msg:"Service Category  Fetched Succesfully",data:serviceCategories})
    } catch (error) {
        return res.status(500).json({msg:"Error while fetching all the Services",error});
    }
}