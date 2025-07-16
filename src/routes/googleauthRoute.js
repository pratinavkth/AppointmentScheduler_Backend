const express = require("express");

const routerss= express.Router();

const oauth2Client = require("../config/oauth");
const routingoauthcontroller = require("../controllers/oauthController");
const authcheck = require("../middelwares/authcheck");
// synct to calendar api
// first sync with calendar than book it will save it


routerss.get("/manual-google-auth",authcheck,routingoauthcontroller.googleAuth);
routerss.get("/redirect",routingoauthcontroller.googleCallback);

module.exports = routerss;