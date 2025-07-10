const NormalUser = require("../models/NormaluserModel");
const ApiError = require("../utils/ApiError");

exports.bookslot  = async(req,res)=>{
    try {
        const {username,useremail,phonenumber,datebooked,selectedService,timeslot} = req.body;
        const userId = req.user.id;
        let bookslot = await NormalUser.create({
            // servicename,
            username,
            useremail,
            phonenumber,
            datebooked,
            selectedService,
            userId:userId,
            timeslot,
            
        });
        return res.status(200).json({
      success: true,
      message: "Slot Booked Successfully",
      data: bookslot,
    });
    } catch (error) {
        ApiError(500,"Error while Booking the slot",error);
    }
}

exports.deleteslot = async(req,res)=>{
    try {
        const userId = req.user.id;
        if(!userId){
            throw new ApiError(400,"userID is not there");
        }
        const {bookid} = req.body;
        if(!bookid){
            throw new ApiError(400,"This is not an bookid");
        }
        const deleteslot = await NormalUser.findOne({where:{id:bookid}});
        await deleteslot.destroy();
        return res.status(200).json({msg:"slot Deleted Succcessfully"});

    } catch (error) {
        throw new ApiError(500,"Error While deleting the slot",error);
    }
}
exports.updateslot = async(req,res)=>{
    try {
        const {bookid,servicename,username,useremail,phonenumber,date,time,servicetype} = req.body;
        const userId = req.user.id;

        const updateid = await NormalUser.findOne({where:{id:bookid}});

        const updateslot={};
        if(servicename)updateslot.servicename = servicename;
        if(username)updateslot.username = username;
        if(useremail)updateslot.servicename = useremail;
        if(phonenumber)updateslot.servicename = phonenumber;
        if(date)updateslot.servicename = date;
        if(time)updateslot.servicename = time;
        if(servicetype)updateslot.servicename = servicetype;

        const updatedid = await updateid.update(updateslot);

        return res.status(200).json({msg:"Slot Updated Succesfully",data:updatedid});
        
    } catch (error) {
        ApiError(500,"Error Occur While updating slot",error);
    }
}
exports.getbookedslot= async(req,res)=>{
try {
    const userId = req.user.id;
    const getbookedslot = await NormalUser.findAll({where:{userId:userId}});
    return res.status(200).json({msg:"Fetched Particular user booked slots",data:getbookedslot});
} catch (error) {
    ApiError(500,"Error Occur While getting the booked Slot");
}
}
exports.getallbookedslots  =async(req,res)=>{
    // const userId = 
    try {
        const allslots = await NormalUser.findAll();
        res.status(200).json({msg:"Fetched All slot",data:allslots});
    } catch (error) {
        ApiError(500,"Error Occur while gettina  all the slots booked");
    }
}