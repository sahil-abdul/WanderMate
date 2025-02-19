const User = require("../modul/user.js");

module.exports.renderSignUpform = (req, res) => {
  res.render("user/signUp.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let user = new User({
      username: username,
      email: email,
    });
    let reg = await User.register(user, password);
    req.login(reg, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", "Wellcome to wonderMate");
      res.redirect("/listing");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signUp");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Wellcome back to wonderMate");
  let redirect = res.locals.redirectUrl || "/listing";
  res.redirect(redirect);
};

module.exports.logOut = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "your are log out now");
    res.redirect("/listing");
  });
};
