const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js"); 
const userController = require("../controllers/user.js");

router.route("/signup")
.get(userController.signUpForm) //signUp form
.post(wrapAsync(userController.signUp)); //signup

router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureFlash: true}),userController.login);

router.get("/logout", userController.logOut); //Logout Route

router.get("/search",userController.search); //Search Route

module.exports = router;
