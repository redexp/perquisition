var app = require('app');

module.exports = function (req, res, next) {
	res.locals.title = '';
	res.locals.IS_DEV = app.IS_DEV;
	res.locals.IS_PROD = app.IS_PROD;

	res.locals.__ = function (name) {
		return name;
	};

	require('./styles')(req, res);
	require('./scripts')(req, res);
	require('./renderTranslationsFor')(req, res);
	require('./serverData')(req, res);

	next();
};