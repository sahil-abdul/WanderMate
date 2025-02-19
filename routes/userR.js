const express = require("express");
const router = express.Router();
const User = require("../modul/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveUrl } = require("../middleware.js");
const userCtrl = require("../controllers/user.js");

router
  .route("/signUp")
  .get(userCtrl.renderSignUpform) //sign up form show route
  .post(wrapAsync(userCtrl.signUp)); //sign up route

router
  .route("/login")
  .get(userCtrl.renderLoginForm) //login form show route
  .post(
    saveUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,  
    }),
    userCtrl.login
  ); //login the user

//log out route
router.get("/logout", userCtrl.logOut);

module.exports = router;
