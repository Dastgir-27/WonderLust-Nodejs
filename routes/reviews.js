const express = require("express");
const router = express.Router({mergeParams: true}); //mergeParams is used when there is parameter in the route.
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview,isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//post review route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
