
/**
 * Module dependencies.
 */

var fs = require('fs');
var favicon = require('serve-favicon');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

// migration to express 4
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var errorHandler = require('errorhandler');

var app = express();

var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID.toString();
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET.toString();
var FACEBOOK_CALLBACK = 'http://www.jdl.ro/auth/facebook/callback';

routes.sync = require('./routes/sync');
routes.check = require('./routes/check');
routes.auth = require('./routes/auth');
routes.apply = require('./routes/apply');
routes.contact = require('./routes/contact');
routes.update = require('./routes/update');
routes.sponsorships = require('./routes/sponsorships');
routes.talks = require('./routes/talks');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || '127.0.0.1');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new FacebookStrategy({
		clientID: FACEBOOK_APP_ID,
		clientSecret: FACEBOOK_APP_SECRET,
		callbackURL: FACEBOOK_CALLBACK,
	},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			return done(null, profile);
		});
	}
));

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'user_education_history', 'user_birthday'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'user_education_history', 'user_birthday'] }), function (req, res) {
	if (req.session.passport.user) console.log(req.session.passport.user['_json'].education);
	res.end('<script>window.close();</script>');
});
app.get('/auth', routes.auth);
app.get('/sponsorizari', routes.sponsorships);
app.get('/talks', routes.talks);

app.post('/sync', routes.sync);
app.post('/check', routes.check);
app.post('/apply', routes.apply);
app.post('/contact', routes.contact);
app.post('/g/live/update', routes.update);

http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
