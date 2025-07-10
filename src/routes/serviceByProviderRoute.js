const express = require("express");
const authcheck = require("../middelwares/authcheck");
const rolecheck = require("../middelwares/rolecheck");
const serviceProviderController = require("../controllers/servicesbyProvidersController");

const serviceproviderRoute  = express.Router();

serviceproviderRoute.get("/getallservices",authcheck,rolecheck("user","admin","serviceprovider"),serviceProviderController.getAllService);
serviceproviderRoute.get("/getregisteredservices",authcheck,rolecheck("serviceprovider"),serviceProviderController.getcreatedServices);
serviceproviderRoute.post("/createservice",authcheck,rolecheck("serviceprovider"),serviceProviderController.createservice);
serviceproviderRoute.put("/updateservice",authcheck,rolecheck("serviceprovider"),serviceProviderController.updateService);
serviceproviderRoute.delete("/deleteservice",authcheck,rolecheck("serviceprovider"),serviceProviderController.deleteService);

module.exports = serviceproviderRoute;