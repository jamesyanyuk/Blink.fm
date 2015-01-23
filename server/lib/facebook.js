var FB = require('fb');
var secrets = require('../config/keys.js');

//Map from username to facebook radio map
var radioMap = {}

function _createNewStation(user) {
	var body = {
		"object": {
			"og:url": "http://blink.fm/#/" + user.username,
			"og:title": user.username + "'s radio",
			"og:type": "music.radio_station",
			"og:image": "http://www.tikiislandradio.com/Tiki_Island_7.jpg",
			"og:description": "Broadcast your music taste to the world",
			"fb:app_id": secrets.facebook.clientID
		}
	};
	FB.setAccessToken(user.accessToken);
	FB.api('me/objects/music.radio_station', 'post', body, function(response) {
		if (!response || response.error) {
			console.log(!response ? 'error occurred' : response.error);
		} else {
			console.log("Radio ID: " + response.id);
			radioMap[user.username] = response.id;
			_broadcast(response.id);
		}
	});
}

function _broadcast(id) {
	FB.api('me/' + secrets.broadcast_url, 'post', {
		"radio_station": id
	}, function(response) {
		if (!response || response.error) {
			console.log(!response ? 'error occurred' : response.error);
		} else {
			console.log("Post ID: " + response.id);
		}
	});
}

function broadcastToServer(user) {
	if (!radioMap[user.username]) {
		_createNewStation(user);
	} else {
		_broadcast(radioMap[user.username])
	}
}

exports.broadcastToServer = broadcastToServer;