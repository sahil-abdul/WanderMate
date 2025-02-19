const Listing = require("./modul/listing.js");
const Review = require("./modul/review.js");
const { listingSchema, reviewSchema } = require("./validateSchema.js");
const ExpressErr = require("./utils/ExpressErr.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Please first logIn to WanderMate");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports.saveUrl = (req,res,next) => {
  if(req.session.redirectUrl){
  res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req,res,next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!(res.locals.currUsr && res.locals.currUsr._id.equals(listing.owner._id))){
    req.flash("error","you are not owner of this listing")
    return res.redirect(`/listing/${id}`)
  }
  next();
};

module.exports.isAuthor = async (req,res,next) => {
  let {id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!(res.locals.currUsr && res.locals.currUsr._id.equals(review.author._id))){
    req.flash("error","you are not owner of this Riview")
    return res.redirect(`/listing/${id}`)
  }
  next();
};

module.exports.validateSchema = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressErr(400, errMsg);
  } else {
    next();
  }
};
module.exports.reviewValidate = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressErr(400, errMsg);
  } else {
    next();
  }
};
