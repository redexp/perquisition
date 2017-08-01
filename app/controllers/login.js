var app = require('app');
var passport = require('app/lib/passport');

app.post('/login', passport.authenticate('local'), function (req, res) {
	res.json({id: req.user.id});
});

app.use(function (req, res, next) {
	if (!req.user) {
		res.render('login/index');
	}
	else {
		next();
	}
});

app.get('/', function (req, res) {
	var user = req.user;

	if (user.hasRole('teacher')) {
		res.redirect('/teacher');
	}
	else if (user.hasRole('student')) {
		res.redirect('/student');
	}
});