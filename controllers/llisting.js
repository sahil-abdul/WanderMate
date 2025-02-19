const Listing = require("../modul/listing.js");

module.exports.index = async (req, res, next) => {
  let listing = await Listing.find({});
  res.render("listing/index.ejs", { listing });
};

module.exports.newListingForm = (req, res) => {
  res.render("listing/add.ejs");
};

module.exports.renderUpdateForm = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you serching for is does not exists");
    res.redirect("/listing");
  }
  let orgImage = listing.image.url;
  orgImage = orgImage.replace("/upload", "/upload/h_200/e_blur:100");
  res.render("listing/update.ejs", { listing, orgImage });
};

module.exports.upadtingListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "listing was updated!");
  res.redirect(`/listing/${id}`);
};

module.exports.deletingListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing was deleted!");
  res.redirect(`/listing/`);
};

module.exports.detailListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you serching for is does not exists");
    res.redirect("/listing");
  }
  res.render("listing/show.ejs", { listing });
};

module.exports.addinglisting = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = new Listing(req.body.listing);
  listing.image = { url, filename };
  listing.owner = req.user._id;
  req.flash("success", "new listing created!");
  await listing.save();
  res.redirect("/listing");
};

module.exports.showSrcListing = async (req,res) => {
  let {country} = req.query;
  let listing = await Listing.find({country:{ $regex: new RegExp(country, 'i') }});
  if (listing.length == 0) {
    req.flash("error", "Listing you serching for is does not exists");
    res.redirect("/listing");
  }
  // console.log(listing.length)
  res.render("listing/srcResult.ejs",{listing})
}

module.exports.filter = async (req,res) => {
  let {id:category} = req.params;
  let listing = await Listing.find({category:{ $regex: new RegExp(category, 'i') }});
  if (listing.length == 0) {
    req.flash("error", "Listing for that perticular category is not available");
    res.redirect("/listing");
  }
  res.render("listing/filter.ejs",{listing})
}
