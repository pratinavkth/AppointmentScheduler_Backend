const nodemailer = require("nodemailer");

const sendMail= async(to,subject,html)=>{

    try{
const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user:process.env.GMAIL_APP_EMAIL_ID,
        pass:process.env.GMAIL_APP_PASS,
    },

});

const mailOptions = {
    from:`"Appointment Scheduler "<${process.env.GMAIL_APP_EMAIL_ID}>`,
    to:to,
    subject:subject,
    html:html, 
};

await transporter.sendMail(mailOptions);
console.log("Email sent to",to);
    }
    catch(e){
        console.error("There is issue  while sending the email",e);
        throw e;
    }
}

module.exports= sendMail;