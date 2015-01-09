var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

/* For Google/Facebook authentication */
//var configAuth = require('./auth');

module.exports = function(passport) {
    passport.use('local-login', new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function(req, username, password, done) {
                // Temporarily disabled database for testing

                // Check whether or not user exists in userdb
                // userdb.authenticateUser(username, password, function(err, user) {
                //     if(err) {
                //         console.log('Error during login (potentially due to database error)');
                //         return done(err);
                //     } else if(!user) {
                //         console.log('Bad username/password during logon');
                //         return done(undefined, false, req.flash('loginMessage', 'Bad username/password'));
                //     } else return done(undefined, user);
                // });
                var user = { username: 'bob', password: 'joe' }
                return done(undefined, user); // test
            })
    );

    passport.use('local-signup', new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function(req, username, password, done) {
                // Check for proper username and password input
                var RFC822 = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
                if(username.search(RFC822) === -1 || password.length < 6 || password.length > 18)
                    return done(undefined, false, req.flash('signupMessage', 'Fix issues below.'));
                // Check whether or not user exists in userdb
                userdb.createUser(username, password, db.GRP_UNVERIFIED, function(err, user) {
                    if(err) {
                        console.log('Username already taken.');
                        return done(undefined, false, req.flash('signupMessage', 'Username already taken.'));
                    } else {
                        console.log(user);
                        return done(undefined, user);
                    }
                });
            })
    );

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
}
