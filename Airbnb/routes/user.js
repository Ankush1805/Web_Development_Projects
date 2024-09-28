const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/user.js");

/*
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));
*/
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));


/*
router.get("/login", userController.renderLoginForm);

router.post("/login", saveRedirectUrl, userController.login);
*/
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, userController.login);


router.get("/logout", userController.logout);


module.exports = router;