const express = require('express');
const router = express.Router({ mergeParams: true }); // Allows access to :id from parent route
const wrapAsync = require('../utils/wrapAsync.js');
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");



// POST route to add a new review
router.post(
    '/',
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createNewReview)
);

// DELETE route to remove a review
router.delete(
    '/:reviewid',
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;

 