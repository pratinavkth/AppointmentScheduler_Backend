const express = require("express");
const serviceCategoryController = require("../controllers/service_category");
const authcheck = require("../middelwares/authcheck");
const rolecheck = require("../middelwares/rolecheck");
const subServiceRouter = require("./sub_service_route");
const serviceproviderRoute = require("./serviceByProviderRoute");
const adminRouter = express.Router();

adminRouter.use('/subservice',subServiceRouter);
// adminRouter.use(serviceproviderRoute);

adminRouter.post("/create_service",authcheck,rolecheck("admin"),serviceCategoryController.serviceCategoryCreate);
adminRouter.put("/update_service",authcheck,rolecheck("admin"),serviceCategoryController.updateServiceCategory);
adminRouter.delete("/delete_service",authcheck,rolecheck("admin"),serviceCategoryController.deleteServiceCategory);/////
// adminRouter.delete("/delete_service",authcheck,serviceCategoryController.deleteServiceCategory);
adminRouter.get("/getall_service",authcheck,rolecheck("admin"),serviceCategoryController.getServiceCategory);

module.exports = adminRouter;