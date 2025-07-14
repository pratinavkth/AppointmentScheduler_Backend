const {google} = require("googleapis");

const oauth2Client = require("../config/oauth");
const NormalUser = require("../models/NormaluserModel");
const ApiError = require("../utils/ApiError");
const { getUserTokens, createOAuthClient } = require('./oauthController');

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


// exports.bookslotwithcalender  = async(req,res)=>{
//     try {
//         const {username,useremail,phonenumber,datebooked,selectedService,timeslot} = req.body;
//         const userId = req.user.id;
//         let bookslot = await NormalUser.create({
//             // servicename,
//             username,
//             useremail,
//             phonenumber,
//             datebooked,
//             selectedService,
//             userId:userId,
//             timeslot,
            
//         });

//         const userTokens = await getUserTokens(userId);
//         if (!userTokens) {
//            return res.status(200).json({
//             success: true,
//             message: "Slot booked, but Google Calendar is not connected.",
//             data: bookslot,
//         });
//     }
//     oauth2Client.setCredentials(userTokens);


//     const startDateTime = new Date(`${datebooked}T${timeslot}:00`);
//     const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

//     const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

//     const event = {
//       summary: selectedService,
//       description: `Booked for ${selectedService} `,
//       start: {
//         dateTime: startDateTime.toISOString(),
//         timeZone: 'Asia/Kolkata',
//       },
//       end: {
//         dateTime: endDateTime.toISOString(),
//         timeZone: 'Asia/Kolkata',
//       },
//     };

//      await calendar.events.insert({
//       calendarId: 'primary',
//       resource: event,
//     });

        
        
//         return res.status(200).json({
//       success: true,
//       message: "Slot Booked Successfully",
//       data: bookslot,
//     });
//     } catch (error) {
//        throw new ApiError(500,"Error while Booking the slot",error);
//     }
// }
exports.bookslotwithcalender = async (req, res) => {
    try {
        const { username, useremail, phonenumber, datebooked, selectedService, timeslot } = req.body;
        const userId = req.user.id;

        // Input validation
        // if (!username || !useremail || !phonenumber || !datebooked || !selectedService || !timeslot) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "All fields are required: username, useremail, phonenumber, datebooked, selectedService, timeslot"
        //     });
        // }

        // Validate date format
        const bookingDate = new Date(datebooked);
        if (isNaN(bookingDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Please use YYYY-MM-DD format."
            });
        }

        // Validate time format (assuming HH:MM format)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(timeslot)) {
            return res.status(400).json({
                success: false,
                message: "Invalid time format. Please use HH:MM format (24-hour)."
            });
        }

        console.log('📅 Creating booking for user:', userId);
        console.log('📊 Booking details:', { username, useremail, selectedService, datebooked, timeslot });

        // Create booking in database
        let bookslot = await NormalUser.create({
            username,
            useremail,
            phonenumber,
            datebooked,
            selectedService,
            userId: userId,
            timeslot,
        });

        console.log('✅ Booking created in database:', bookslot.id);

        // Try to get user tokens for calendar integration
        const userTokens = await getUserTokens(userId);
        if (!userTokens) {
            console.log('⚠️ No Google Calendar tokens found for user');
            return res.status(200).json({
                success: true,
                message: "Slot booked successfully, but Google Calendar is not connected. Connect your calendar to sync appointments.",
                data: bookslot,
                calendarStatus: 'not_connected'
            });
        }

        try {
            // Create OAuth client and set credentials
            const oauth2Client = createOAuthClient();
            oauth2Client.setCredentials(userTokens);

            console.log('🔄 Creating Google Calendar event...');

            // Create start and end datetime
            const startDateTime = new Date(`${datebooked}T${timeslot}:00`);
            const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 minutes duration

            // Validate datetime
            if (isNaN(startDateTime.getTime())) {
                throw new Error('Invalid datetime combination');
            }

            const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

            const event = {
                summary: `${selectedService} - ${username}`,
                description: `Service: ${selectedService}\nClient: ${username}\nEmail: ${useremail}\nPhone: ${phonenumber}`,
                start: {
                    dateTime: startDateTime.toISOString(),
                    timeZone: 'Asia/Kolkata',
                },
                end: {
                    dateTime: endDateTime.toISOString(),
                    timeZone: 'Asia/Kolkata',
                },
                attendees: [
                    {
                        email: useremail,
                        displayName: username
                    }
                ],
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 }, // 24 hours before
                        { method: 'popup', minutes: 30 }, // 30 minutes before
                    ],
                },
            };

            const calendarResponse = await calendar.events.insert({
                calendarId: 'primary',
                resource: event,
                sendUpdates: 'all' // Send email notifications
            });

            console.log('✅ Calendar event created:', calendarResponse.data.id);

            return res.status(200).json({
                success: true,
                message: "Slot booked successfully and added to Google Calendar",
                data: bookslot,
                calendarStatus: 'synced',
                calendarEventId: calendarResponse.data.id,
                calendarEventLink: calendarResponse.data.htmlLink
            });

        } catch (calendarError) {
            console.error('❌ Calendar integration failed:', calendarError);

            // Check if it's a token refresh issue
            if (calendarError.code === 401 || calendarError.message.includes('invalid_grant')) {
                console.log('🔄 Token might be expired, need to re-authenticate');
                
                return res.status(200).json({
                    success: true,
                    message: "Slot booked successfully, but calendar sync failed. Please reconnect your Google Calendar.",
                    data: bookslot,
                    calendarStatus: 'auth_required',
                    error: 'Calendar authentication expired'
                });
            }

            // For other calendar errors, still return success for booking
            return res.status(200).json({
                success: true,
                message: "Slot booked successfully, but calendar sync failed. Please try again or contact support.",
                data: bookslot,
                calendarStatus: 'sync_failed',
                error: calendarError.message
            });
        }

    } catch (error) {
        console.error('❌ Error while booking slot:', error);
        
        // Handle specific database errors
        if (error.code === 11000) { // Duplicate key error
            return res.status(409).json({
                success: false,
                message: "This time slot is already booked. Please choose a different time.",
                error: 'Duplicate booking'
            });
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: error.message
            });
        }

        // Generic error handling
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: error.errors
            });
        }

        // Fallback error response
        return res.status(500).json({
            success: false,
            message: "Internal server error while booking slot",
            error: error.message
        });
    }
};