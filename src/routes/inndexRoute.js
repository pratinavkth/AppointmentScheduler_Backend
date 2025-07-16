const express = require("express");
const indexRoute = express.Router();
const authRoutes = require("./authRoute");
const adminRoutes = require("./adminRoutes");
const serviceRoute = require("./serproviderRoute");
const userRoute1 = require("./userRoute");
const googleauth = require("./googleauthRoute");


indexRoute.use('/authroute',authRoutes);
indexRoute.use('/adminRoute',adminRoutes);
indexRoute.use('/serviceRoute',serviceRoute);
indexRoute.use('/userRoute',userRoute1);

indexRoute.use('/googleauth',googleauth);


module.exports = indexRoute;
