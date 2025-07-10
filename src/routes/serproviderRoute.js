const express = require("express");
const serviceproviderRoute = require("./serviceByProviderRoute");

const serviceRoute =express.Router();


serviceRoute.use(serviceproviderRoute);

module.exports = serviceRoute;