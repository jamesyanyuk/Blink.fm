var express = require('express');
var router = express.Router();

var passport = require('passport');

var isAuth = function(req, res, next) {
    if(req.isAuthenticated()) {
        req.flash('homeMessage', 'Already logged in.');
        return res.redirect('/');
    }
    next();
}

router.post('/login', function(req, res, next) {
    if(req.isAuthenticated()) {
        req.flash('homeMessage', 'Already logged in.');
        return res.redirect('/');
    } else if(!req.body.username || !req.body.password) {
        req.flash('loginMessage', 'Field(s) left blank.');
        return res.redirect('/login');
    }

    passport.authenticate('local-login', function(err, user, info) {
        if(err) return next(err);
        else if(!user) {
            req.flash('loginMessage', 'Incorrect username/password.');
            return res.redirect('/login');
        }

        req.login(user, function(err) {
            if(err) return next(err);
            req.flash('homeMessage', 'Successfully logged in.');
            return res.redirect('/');
        });
    })(req, res, next);
});

router.post('/signup', function(req, res, next) {
    if(req.isAuthenticated()) {
        req.flash('homeMessage', 'Already logged in.');
        return res.redirect('/');
    } else if(!req.body.username || !req.body.password) {
        req.flash('signupMessage', 'Field(s) left blank.');
        return res.redirect('/signup');
    } else if(req.body.password.length < 6) {
        req.flash('signupMessage', 'Password must be at least 6 characters long.');
        return res.redirect('/signup');
    }

    passport.authenticate('local-signup', function(err, user, info) {
        if(err) return next(err);
        else if(!user) {
            req.flash('signupMessage', 'Error signing up.');
            return res.redirect('/signup');
        }

        req.login(user, function(err) {
            if(err) return next(err);
            req.flash('homeMessage', 'Successfully signed up.');
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('homeMessage', 'Successfully logged out.');
    res.redirect('/');
});

module.exports = router;
