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
    facebook.broadcastStation(req.user);
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

router.get('/logout', function(req, res) {
    req.logout();
    res.end();
});

module.exports = router;
