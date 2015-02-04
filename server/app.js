var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

var auth = require('./routes/auth');
var api = require('./routes/api');
var recommendation_engine = require('./routes/recommendation_engine');

var keys = require('./config/keys');

// Passport authentication strategy configuration
var configPassport = require('./config/passport');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(session({ secret: keys.sessionSecret,
				  resave: true,
				  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

configPassport(passport);

app.use('/auth', auth);
app.use('/api',api);
app.use('/recommendation-engine', recommendation_engine);

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
		// res.render('error', {
		// 	message: err.message,
		// 	error: err
		// });
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
		// res.render('error', {
		// 	message: err.message,
		// 	error: {}
		// });
	});
}

module.exports = app;
