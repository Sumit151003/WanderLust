const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require('passport');
const {saveRedirectUrl} = require('../middlewares.js');
const userController = require("../controllers/users.js");

// User SignUp

router
.route('/signUp')
.get(userController.renderSignUpPage)
.post(wrapAsync(userController.signUp));

// Login User
router.route('/login')
.get(userController.renderLogInPage)
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.logIn));

//LogOut user
router.get('/logout', userController.logOut);

module.exports = router;