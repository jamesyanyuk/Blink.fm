var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var google = require('googleapis');
var youtube = google.youtube('v3');

var YOUTUBE_API_KEY = 'AIzaSyA7QOe5_6VAQBnO-XihFvcBOV1xomJ1gaQ';

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

/**
 * Development Settings
 */
if (app.get('env') === 'development') {
	// This will change in production since we'll be using the dist folder
	app.use(express.static(path.join(__dirname, '../client')));
	// This covers serving up the index page
	app.use(express.static(path.join(__dirname, '../client/.tmp')));
	app.use(express.static(path.join(__dirname, '../client/app')));

	// Error Handling
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

/**
 * Production Settings
 */
if (app.get('env') === 'production') {

	// changes it to use the optimized version for production
	app.use(express.static(path.join(__dirname, '/dist')));

	// production error handler
	// no stacktraces leaked to user
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});
}

var buffer = [];

app.get('/recommendation-engine/add-video/:videoId', function (req, res) {
	var videoId = req.params.videoId;

	if (videoId) {
		// Add the current videoId to buffer.
		buffer = [];
		buffer.push(videoId);

		// Load the mix playlist and add it to buffer.
		var mixPlaylistId = 'RD' + videoId;
		youtube.playlistItems.list({
			key: YOUTUBE_API_KEY,
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
				res.end();
			} else {
				res.status(500).end();
			}
		});
	} else {
		res.status(500).end();
	}
});

app.get('/recommendation-engine/next/', function (req, res) {
	console.log(buffer);
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

module.exports = app;
