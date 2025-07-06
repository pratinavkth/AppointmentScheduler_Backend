const express = require("express");
const authcheck = require("../middelwares/authcheck");
const rolecheck = require("../middelwares/rolecheck");
const ServicesS = require("../controllers/service_controller");

const subServiceRouter = express.Router();

subServiceRouter.post("/create_subcategory",authcheck,rolecheck("admin"),ServicesS.serviceProvideCreate);
subServiceRouter.put("/update_subcategory",authcheck,rolecheck("admin"),ServicesS.updateSubService);
subServiceRouter.delete("/delete_service",authcheck,rolecheck("admin"),ServicesS.deleteSubService);
subServiceRouter.get("/getAllServices",authcheck,rolecheck("admin"),ServicesS.getallsubCategoryservice);


module.exports =subServiceRouter;