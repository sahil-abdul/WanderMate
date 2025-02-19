const express = require("express");
const router = express.Router();
exports.router = router;
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner, validateSchema } = require("../middleware.js");
const listingControllers = require("../controllers/llisting.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingControllers.index)) //show or index route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateSchema,
    wrapAsync(listingControllers.addinglisting)
  ); //ading new listing

//displaying form for new listing
router.get("/new", isLoggedIn, wrapAsync(listingControllers.newListingForm));

//showing serching result
router.get("/search",wrapAsync(listingControllers.showSrcListing))

router
  .route("/:id/edit")
  .get(isLoggedIn, isOwner, wrapAsync(listingControllers.renderUpdateForm)) //displaying update form
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateSchema,
    wrapAsync(listingControllers.upadtingListing)
  ); //updating the page

//deleting the page
router.delete(
  "/:id/del",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.deletingListing)
);

//showing filter result
router.get("/filter/:id", wrapAsync(listingControllers.filter));

//detail route
router.get("/:id", wrapAsync(listingControllers.detailListing));



module.exports = router;
