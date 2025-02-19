const express = require("express");
const router = express.Router({ mergeParams: true });
exports.router = router;
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, reviewValidate, isAuthor } = require("../middleware.js");
const reviewCtrl = require("../controllers/review.js");

//reviews
//adding review
router.post(
  "/",
  reviewValidate,
  isLoggedIn,
  wrapAsync(reviewCtrl.addingreview)
);

//deleting reviews
router.delete("/:reviewId", isAuthor, wrapAsync(reviewCtrl.deletingReview));

module.exports = router;
