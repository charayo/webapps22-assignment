const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

module.exports = function (passport) {
  //serialize
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  //used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  //sign up
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, //allow us to pass back the entire request to the callback
      },
      function (req, email, password, done) {
        User.findOne({ "local.email": email }, function (err, user) {
          if (err) return done(err);

          if (user) {
            return done(
              null,
              false,
              req.flash("signupMessage", "That email is already taken")
            );
          } else {
            const newUser = new User();

            newUser.local.email = email;
            newUser.local.password = newUser.generateHash(password);

            newUser.save(function (err) {
              if (err) throw err;
              return done(null, newUser);
            });
          }
        });
      }
    )
  );

  //log in
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, //allow us to pass back the entire request to the callback
      },
      function (req, email, password, done) {
        User.findOne({ "local.email": email }, function (err, user) {
          if (err) return done(err);

          if (!user) {
            return done(
              null,
              false,
              req.flash("loginMessage", "No user fouund")
            );
          }
          if (!user.validPassword(password)) {
            return done(
              null,
              false,
              req.flash("loginMessage", "Oops! Wrong password.")
            );
          }
          return done(null, user);
        });
      }
    )
  );
};
