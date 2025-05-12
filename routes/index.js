var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const { use } = require("../app");
const passport = require("passport");

const localStatergy = require("passport-local");
passport.use(new localStatergy(userModel.authenticate()));

/* GET home page. */
router.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

router.get("/profile", isloggedin, async (req, res) => {
  
  const user = await userModel.findOne({
    username: req.session.passport.user
  })

  res.render("profile", {user});
});

router.get("/login", (req, res, next) => {
  res.render("login", {error: req.flash('error')});
});

router.get("/feed", (req, res, next) => {
  res.render("feed");
});

router.post("/register", (req, res) => {
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
  });

  userModel.register(userData, req.body.password).then(() => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {}
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isloggedin(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}
module.exports = router;
