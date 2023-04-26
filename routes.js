const Post = require("./models/Post");
module.exports = function (app, passport) {
  app.get("/", function (req, res) {
    res.render("index.ejs"); //Load the index.ejs file
  });

  //show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  //process the signup form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/newpost", //redirect to the secure profile section
      failureRedirect: "/login", //redirect back to the login page if there is an error
      failureFlash: true, //allow flash message
    })
  );

  app.get("/signup", function (req, res) {
    // console.log(res.body);
    //render the page and pass in any flash data if it exists
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  //process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile", //redirect to the secure profile section
      failureRedirect: "/signup", //redirect back to the signup page if there is an error
      failureFlash: true, //allow flash message
    })
  );

  // we will use route middleware to verify this( the isLoggedIn function)
  app.get("/profile", isLoggedIn, function (req, res) {
    res.render("profile.ejs", {
      user: req.user, //get the user out of session and pass to template
    });
  });
  //make post route protected with middleware
  app.get("/newpost", isLoggedIn, function (req, res) {
    res.render("blogPost.ejs", {
      user: req.user, //get the user out of session and pass to template
    });
  });
  //process the blog post
  app.post("/blogpost", isLoggedIn, function (req, res) {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      user_id: req.user.id
    });
    post.save();
    res.redirect('/blog')
    
  });
  ///blog page
  app.get("/blog", function (req, res) {
    Post.find({}, function (err, posts) {
      if (err) {
        console.log(err);
      } else {
        res.render("blogPage.ejs", {
          posts: posts,
        });
        console.log(posts);
      }
    });
  });

  //Logout
  app.get("/logout", function (req, res) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
};

//route middleware to make sure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  //if they aren't redirect them to the home page
  res.redirect("/");
}
