const express = require("express");
const authController = require("../controllers/auth_controller");
const authcheck = require("../middelwares/authcheck");
const rolecheck = require("../middelwares/rolecheck");
const authRoute = express.Router();


authRoute.post('/register',authController.Register);
authRoute.post('/registrationbyadmin',authcheck,rolecheck("admin"),authController.registration_by_admin);
authRoute.get('/login',authController.Login);
authRoute.get('/verifyEmail',authController.verifyEmail);
authRoute.post('/refreshtoken',authController.refreshToken);
authRoute.post('/logout',authController.logout);

module.exports = authRoute;