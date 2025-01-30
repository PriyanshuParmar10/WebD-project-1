const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});



router
    .route("/")
// All listings route
    .get(wrapAsync(listingController.index))
// Create Route
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,
        wrapAsync(listingController.createListing));


// search route	
router.get("/search",wrapAsync(listingController.searchListing));
        
// New Route
router.get("/new", isLoggedIn,listingController.renderNewFrom);


// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListingForm));

// category route
router.get("/category/:category",wrapAsync(listingController.categoryListing));

router
    .route("/:id")
// Show Route
    .get(wrapAsync(listingController.showNewFrom))
// Update Route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,
        wrapAsync(listingController.updatedListing))
// Destroy Route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports=router;