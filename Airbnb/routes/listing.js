const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// router.route ===============================================================================================================================

/**

//Index Route
router.get("/", wrapAsync(listingController.index));

// Create Route
router.post("/", validateListing, wrapAsync(listingController.createListing));

*/

// Index Route + Create Route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

/**
 
// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

*/

// New Form
router.get("/new", isLoggedIn,  listingController.renderNewForm); // placing new route above to avoid conflict it as /:id

// Show Route + Update Route + Delete Route
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;