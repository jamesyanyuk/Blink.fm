var FB = require('fb');
var facebook = require('../config/keys.js').facebook;

//Map from username to facebook radio map
var radioMap = {}

function _createNewStation(user) {
	var body = {
		"object": {
			"og:url": "http://blink.fm/#/" + user.username,
			"og:title": user.username + "'s radio",
			"og:type": "music.radio_station",
			"og:image": facebook.story.image,
			"og:description": "Broadcast your music taste to the world",
			"fb:app_id": facebook.auth.clientID
		}
	};
	FB.setAccessToken(user.accessToken);
	FB.api('me/objects/music.radio_station', 'post', body, function(response) {
		if (!response || response.error) {
			console.error(!response ? 'error occurred' : response.error);
		} else {
			radioMap[user.username] = response.id;
			_broadcast(response.id);
		}
	});
}

function _broadcast(id) {
	FB.api('me/' + facebook.story.broadcast_url, 'post', {
		"radio_station": id
	}, function(response) {
		if (!response || response.error) {
			console.error(!response ? 'error occurred' : response.error);
		}
	});
}

function broadcast(user) {
	if (!radioMap[user.username]) {
		_createNewStation(user);
	} else {
		_broadcast(radioMap[user.username])
	}
}

exports.broadcast = broadcast;