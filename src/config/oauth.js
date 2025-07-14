
const {google} =require("googleapis");
require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.SECRET_ID,
    process.env.REDIRECT,
);

module.exports = oauth2Client;
