const Listing = require("../models/listingSchema");
const Review = require("../models/reviewSchema");

module.exports.createNewReview = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.createdBy = req.user._id;
    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    req.flash("success", "New review posted");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
};