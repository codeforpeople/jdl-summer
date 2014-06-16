
/**
 * Module dependencies.
 */

var fs = require('fs');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('https');
var path = require('path');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

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

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
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
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'user_education_history', 'user_birthday'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { scope: ['email', 'public_profile', 'user_education_history', 'user_birthday'] }), function (req, res) {
	if (req.session.passport.user) console.log(req.session.passport.user['_json'].education);
	res.end('<script>window.close();</script>');
});
app.get('/auth', routes.auth);

app.post('/sync', routes.sync);
app.post('/check', routes.check);
app.post('/apply', routes.apply);
app.post('/contact', routes.contact);
app.post('/g/live/update', routes.update);

var options = {
	key: fs.readFileSync('./server.pem'),
	cert: fs.readFileSync('./certificate.pem')
};

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
