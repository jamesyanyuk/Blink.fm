var express = require('express');
var router = express.Router();

router.get("/user", function(req, res){
	if (req.user){
		res.json(req.user);
		return;
	}
});

module.exports = router;
