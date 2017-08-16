const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authHelpers = require('./_helpers');

const init = require('./passport');
const chores_tracker_user = require('../db/models').chores_tracker_user

const options = {};

init();

passport.use(new LocalStrategy(options, (username, password, done) => {
  // check to see if the username exists
  chores_tracker_user.findById(username)
  .then((user) => {
    if (!user) return done(null, false);
    if (!authHelpers.comparePass(password, user.password)) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  })
  .catch((err) => { return done(err); });
}));

module.exports = passport;