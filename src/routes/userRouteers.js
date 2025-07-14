const express = require("express");
const authcheck = require("../middelwares/authcheck");
const rolecheck = require("../middelwares/rolecheck");
const userRouterss = require("../controllers/usercontroller");

const userRoutes = express.Router();

userRoutes.post('/bookslot',authcheck,rolecheck('user'),userRouterss.bookslot);
userRoutes.post('/bookslotcal',authcheck,rolecheck('user'),userRouterss.bookslotwithcalender);
userRoutes.delete('/deleteslot',authcheck,rolecheck('user'),userRouterss.deleteslot);
userRoutes.put('/updateslot',authcheck,rolecheck('user'),userRouterss.updateslot);
userRoutes.get('/getslot',authcheck,rolecheck('user'),userRouterss.getbookedslot);
userRoutes.get('/getAllslot',authcheck,rolecheck('admin'),userRouterss.getallbookedslots);

module.exports = userRoutes;