const express = require("express");
const indexRoute = express.Router();
const authRoutes = require("./authRoute");

indexRoute.use('/authroute',authRoutes);

module.exports = indexRoute;
