const passport = require('passport');
const chores_tracker_user = require('../db/models').chores_tracker_user

module.exports = () => {

    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser((id, done) => {
        chores_tracker_user
            .findById(id)
            .then((user) => { done(null, user); })
            .catch((err) => { done(err, null); });
    });

};