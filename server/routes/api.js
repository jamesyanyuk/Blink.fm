var express = require('express');
var router = express.Router();

router.get("/user", function(req, res){
	if (req.user){
		res.json(req.user);
	} else {
		res.json(undefined);
	}
});

module.exports = router;
