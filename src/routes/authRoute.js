const express = require("express");
const authController = require("../controllers/auth_controller");
const authRoute = express.Router();


authRoute.post('/register',authController.Register);
authRoute.get('/login',authController.Login);
authRoute.get('/verifyEmail',authController.verifyEmail);
authRoute.post('/refreshtoken',authController.refreshToken);
authRoute.post('/logout',authController.logout);

module.exports = authRoute;