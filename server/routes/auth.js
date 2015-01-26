var express = require('express');
var router = express.Router();
var passport = require('passport');
var facebook = require('../lib/facebook');

router.get('/facebook', passport.authenticate('facebook', {
    scope: ['email','publish_actions']
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/'
}), function(req, res) {
    facebook.broadcast(req.user);
    res.redirect("/#/"+req.user.username);
    return;
});

router.post('/login', function(req, res, next) {
    if(req.isAuthenticated()) {
        res.json({
            'msg': 'success!',
            'user': req.user
        });
        return;
    } else if(!req.body.username || !req.body.password) {
        res.json({
            'msg': 'failure!'
        });
        return;
    }

    passport.authenticate('local', function(err, user, info) {
        if(err) return next(err);
        else if(!user) {
            res.json({
                'msg': 'failure!'
            });
            return;
        }

        req.login(user, function(err) {
            if(err) return next(err);
            console.log("Authenticated");
            console.log(req.user);
            res.json({
                'msg': 'success!',
                'user': req.user
            });
            return;
        });
    })(req, res, next);
});

// router.post('/signup', function(req, res, next) {
//     if(req.isAuthenticated()) {
//         req.flash('homeMessage', 'Already logged in.');
//         return res.redirect('/');
//     } else if(!req.body.username || !req.body.password) {
//         req.flash('signupMessage', 'Field(s) left blank.');
//         return res.redirect('/signup');
//     } else if(req.body.password.length < 6) {
//         req.flash('signupMessage', 'Password must be at least 6 characters long.');
//         return res.redirect('/signup');
//     }

//     passport.authenticate('local-signup', function(err, user, info) {
//         if(err) return next(err);
//         else if(!user) {
//             req.flash('signupMessage', 'Error signing up.');
//             return res.redirect('/signup');
//         }

//         req.login(user, function(err) {
//             if(err) return next(err);
//             req.flash('homeMessage', 'Successfully signed up.');
//             return res.redirect('/');
//         });
//     })(req, res, next);
// });

router.get('/logout', function(req, res) {
    req.logout();
    res.end();
});

module.exports = router;
