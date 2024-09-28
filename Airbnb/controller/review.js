const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added!");

    console.log(newReview);

    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId }}); // Update the listing by removing the review from the array
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
}