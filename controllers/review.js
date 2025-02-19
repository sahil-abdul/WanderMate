const Listing = require("../modul/listing.js");
const Review = require("../modul/review.js");

module.exports.addingreview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let review = new Review(req.body.review);
  review.author = req.user._id;
  listing.reviews.push(review);
  await listing.save();
  await review.save();
  req.flash("success", "Review was created!");
  res.redirect(`/listing/${req.params.id}`);
};

module.exports.deletingReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review was deleted!");
  res.redirect(`/listing/${id}`);
};
