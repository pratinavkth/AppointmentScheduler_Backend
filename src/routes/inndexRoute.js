const express = require("express");
const indexRoute = express.Router();
const authRoutes = require("./authRoute");
const adminRoutes = require("./adminRoutes")

indexRoute.use('/authroute',authRoutes);
indexRoute.use('/adminRoute',adminRoutes);

module.exports = indexRoute;
