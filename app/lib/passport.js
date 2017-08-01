var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('app/models/user');

module.exports = passport;

passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	},
	function(username, password, done) {
		User.login(username, password)
			.then(function (user) {
				done(null, user || false);
			})
			.catch(function () {
				done(null, false, {message: "Unknown user"});
			})
		;
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.get('id'));
});

passport.deserializeUser(function(id, done) {
	User.getById(id)
		.then(function (user) {
		    done(null, user || false);
		})
		.catch(done)
	;
});
