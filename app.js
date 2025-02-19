if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Review = require("./modul/review.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressErr = require("./utils/ExpressErr.js");
const listingR = require("./routes/listingR.js");
const reviewR = require("./routes/reviewR.js");
const userR = require("./routes/userR.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./modul/user.js");

const dbUrl = process.env.ATLAS_LINK;
exports.app = app;
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter:24*3000
});

store.on("error",() => {
  console.log("ERROR ON MONGO SESSION STRORE",err);
})

const sessionOpt = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};




main()
  .then((res) => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.listen(port, () => {
  console.log("app was running");
});

app.get("/",(req,res) => {
  res.redirect("/listing")
})

app.use(session(sessionOpt));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session(sessionOpt));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUsr = req.user;
  next();
});

app.use("/listing", listingR);
app.use("/", userR);
app.use("/listing/:id/review", reviewR);

//page not found error handaing
app.all("*", (req, res, next) => {
  next(new ExpressErr(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "somethimg went wrong" } = err;
  res.status(statusCode).render("listing/error.ejs", { message });
});
