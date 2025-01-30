const Listing=require("../model/listing");
const Review=require("../model/review");


module.exports.createNewReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview=async (req, res) => {
    const { id, reviewid } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);

    req.flash("success","Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
};