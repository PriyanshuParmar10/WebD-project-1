const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");


// signup
router
    .route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signup));

// login
router
    .route("/login")
    .get(userController.loginForm)
// we will pass an passport.authenticate middleware
    .post(
    saveRedirectUrl, // To save the redirected URL
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    wrapAsync(userController.login));


// logout
router.get("/logout",userController.logout);

module.exports=router;