var express = require('express');
var router = express.Router();
var facebook = require('../lib/facebook');

router.get("/user", function(req, res){
	if (req.user){
		res.json(req.user);
	} else {
		res.json(undefined);
	}
});

router.post("/broadcast-song-to-fb/", function(req, res){
	facebook.broadcastSong(req.body.user, req.body.song);
    res.end();
});

module.exports = router;
