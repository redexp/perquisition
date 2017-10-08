var app = require('app');

if (app.IS_DEV) {
	var removeCache = require('decache');

	app.use(function (req, res, next) {
		removeCache('app/locals');

		next();
	});
}

app.use(require('./login'));

app.use('/test', require('./test'));

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

	if (user.hasRole('admin')) {
		res.redirect('/admin');
	}
	else if (user.hasRole('teacher')) {
		res.redirect('/teacher');
	}
	else if (user.hasRole('student')) {
		res.redirect('/student');
	}
	else {
		res.status(403).send();
	}
});

app.use('/teacher', require('./teacher'));
app.use('/admin', require('./admin'));
app.use('/student', require('./student'));