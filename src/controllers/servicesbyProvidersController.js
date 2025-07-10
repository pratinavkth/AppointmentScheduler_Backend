// creating the service in doctors and in that specifically to like heart surgeon or all
// created by serviceprovider
const ServicesbyProviders = require("../models/serviceproviding_model");
const ApiError = require("../utils/ApiError");

exports.createservice = async(req,res)=>{
    try {
        const {service_providerName,serviceName,Description,price,StartTime,EndTime,service_id,Data} = req.body;
        const userId = req.user.id;
        const serviceProviderExist = await ServicesbyProviders.findOne({where:{service_providerName,provider_id:userId}});
        if(serviceProviderExist){
            return res.status(400).json({msg:"You have already Registered Cant register with same id again"});
        }
        // let Date =  Date.now();
        let createservice = await ServicesbyProviders.create({
            // userRegistrationId:userId,
            service_providerName,
            serviceName,
            Description,
            price,
            StartTime,
            EndTime,
            provider_id:userId,
            service_id,
            Data
        });
        // await createservice.save();
        return res.status(200).json({msg:"Service Registered Successfully",data:createservice});
    } catch (error) {
        return res.status(500).json({msg:"Error Occured While Registring the service",error});
        
    }
}
exports.deleteService = async(req,res)=>{
    try {
        // const userId = req.user.id;
        const {id} = req.body;
        const deleteService = await ServicesbyProviders.findOne({where:{id}});
        if(!deleteService){
            throw new ApiError(400,"Deleting this Service is not authorize to you");
        }
        await deleteService.destroy();
        return res.status(200).json({msg:"Service is Deleted Successfully"});

    } catch (error) {
        return res.status(500).json({msg:"Error Occur while Deleting the Service"});
    }
}

exports.updateService = async(req,res)=>{
    try {
        // const userId = req.user.id;
        // const Id = req.body;
        const {id,service_providerName, serviceName,Description,price,StartTime,EndTime,Data} = req.body;
        const serviceUpdate = await ServicesbyProviders.findOne({where:{id}});
        if(!serviceUpdate){
            throw new ApiError(400,"This not the correct Service");
        }
        const updateService = {};
        
        if(service_providerName) updateService.service_providerName = service_providerName;
        if(serviceName) updateService.serviceName = serviceName;
        if(Description)updateService.Description = Description;
        if(price) updateService.price = price;
        if(StartTime) updateService.StartTime = StartTime;
        if(EndTime) updateService.EndTime = EndTime;
        if(Data)updateService.Data = Data;

        await ServicesbyProviders.update(updateService,{ where: { id } });
        return res.status(200).json({msg:"Service Updated Succesffuly"});

        
    } catch (error) {
       return res.status(500).json({msg:"Error Occur while Updating the Service"}); 
    }
}

exports.getAllService = async(req,res)=>{
    try {
        const Allservices =await ServicesbyProviders.findAll();
        return res.status(200).json({msg:"All services Fetched Succesffuly",data:Allservices});
    } catch (error) {
        return res.status(500).json({msg:"Error Occur while Getting All the Service"});
    }
}

exports.getcreatedServices = async(req,res)=>{
    try {
        const userId = req.user.id;
        const getcreatedServices=await ServicesbyProviders.findAll({where:{provider_id:userId}});
        return res.status(200).json({msg:"Succesfulyy fetched the user registered Api",data:getcreatedServices});
    } catch (error) {
         throw new ApiError(500,"Error While fetching the user Registered Service",error);
    }
}