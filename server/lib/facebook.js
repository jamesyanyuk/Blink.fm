var FB = require('fb');
var Q = require('Q');

var facebook = require('../config/keys.js')().facebook;

// Constants
const FB_SONG_POST_DURATION = 5 * 60 * 1000;

//Map from username to facebook radio map
var radioMap = {}
var lastSongId = null; // This gonna cause bug because it is shared by multiple users.

function broadcastStation(user) {
    if (!radioMap[user.username]) {
        _createNewStation(user);
    } else {
        _broadcastStation(radioMap[user.username])
    }
}

function broadcastSong(user, song) {
    _createNewSong(user, song).then(_broadcastSong).done();
}

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
    FB.api('me/objects/music.radio_station', 'post', body, function (response) {
        if (!response || response.error) {
            console.error(!response ? 'error occurred' : response.error);
        } else {
            radioMap[user.username] = response.id;
            _broadcastStation(response.id);
        }
    });
}

function _createNewSong(user, song) {
    var deferred = Q.defer();

    var ogSongObj = {
        "object": {
            "og:url": "http://blink.fm/" + user.username,
            "og:title": song.title,
            "og:type": "music.song",
            "og:image": "http://img.youtube.com/vi/" + song.video_id + "/default.jpg",
            "og:description": "Broadcast your music taste to the world",
            "fb:app_id": facebook.auth.clientID
        }
    };
    FB.setAccessToken(user.accessToken);
    FB.api('me/objects/music.song', 'post', ogSongObj, function (response) {
        if (!response || response.error) {
            deferred.reject(!response ? 'no response from fb' : response.error);
        } else {
            deferred.resolve(response.id);
        }
    });

    return deferred.promise;
}

function _broadcastStation(id) {
    FB.api('me/' + facebook.story.broadcast_url, 'post', {"radio_station": id},
        function (response) {
            if (!response || response.error) {
                console.error(!response ? 'no response from fb' : response.error);
            }
        }
    );
}

function _broadcastSong(id) {
    var deferred = Q.defer();

    // Delete fb post of the last song.
    if (lastSongId) {
        FB.api(lastSongId, "DELETE", null);
    }

    // Post the current song on fb.
    lastSongId = id;
    FB.api('me/' + facebook.story.broadcast_url, 'post', {
        "song": id,
        "fb:explicitly_shared": "true"
    }, function (response) {
        if (!response || response.error) {
            deferred.reject(!response ? 'no response from fb' : response.error);
        }
    });

    // Self-delete this song on fb after a fix amount of time.
    setTimeout(function () {
        FB.api(id, "DELETE", null);
    }, FB_SONG_POST_DURATION);
}

module.exports = {
    broadcastStation: broadcastStation,
    broadcastSong: broadcastSong
}
