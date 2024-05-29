const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const {validateReview, isLoggedIn, isReviewOwner } = require('../middlewares.js');
const reviewController = require("../controllers/reviews.js");


// Review Submission Route
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createNewReview));

// Review Deletion Route
router.delete('/:reviewId', isLoggedIn, isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;