const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res) => {
    let oneListing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    oneListing.Reviews.push(newReview);
   
    await newReview.save();
    await oneListing.save();
    req.flash("success", "Review Saved Successfully!");
    res.redirect(`/listing/${oneListing.id}`);
}

module.exports.destroyReview = async (req,res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {Reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listing/${id}`);
}