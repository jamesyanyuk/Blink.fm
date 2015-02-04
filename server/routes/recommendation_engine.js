/**
 * Created by hugo on 2/3/15.
 */

var express = require('express');
var router = express.Router();
var google = require('googleapis');
var youtube = google.youtube('v3');
var keys = require('../config/keys');

router.get('/add-video/:videoId', function (req, res) {
    var videoId = req.params.videoId;

    if (videoId) {
        // Add the current videoId to buffer.
        var buffer = [];
        buffer.push(videoId);

        // Load the mix playlist and add it to buffer.
        var mixPlaylistId = 'RD' + videoId;
        youtube.playlistItems.list({
            key: keys.youtube,
            part: 'id,snippet',
            playlistId: mixPlaylistId,
            maxResults: 50
        }, function (err, data) {
            if (data && data.items) {
                for (i = 0; i < data.items.length; i++) {
                    if (data.items[i].snippet.resourceId.videoId) {
                        var vidId = data.items[i].snippet.resourceId.videoId;
                        if (buffer.indexOf(vidId) === -1) buffer.push(vidId);
                    }
                }

            }

            // save playlist to session
            req.session.buffer = buffer;
            res.end();
        });
    } else {
        res.status(500).end();
    }
});

router.get('/next/', function (req, res) {
    var buffer = req.session.buffer;

    if (buffer.length > 0) {
        var videoId = buffer[0];
        buffer.shift();
        res.send({
            'videoId': videoId
        })
    } else {
        res.status(500).end();
    }
});

module.exports = router;