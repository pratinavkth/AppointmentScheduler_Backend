const express = require("express");
const userRoutes = require("./userRouteers");

const userRoute1 = express.Router();

userRoute1.use(userRoutes);

module.exports= userRoute1;