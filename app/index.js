var app = module.exports = require('express')();
var path = require('path');

app.config = require('app/config');
app.IS_DEV = app.get('env') === 'development';
app.IS_PROD = app.get('env') === 'production';
app.ROOT_DIR = path.join(__dirname, '..');
app.PUBLIC_DIR = app.ROOT_DIR + '/public';
app.UPLOADS_DIR = app.ROOT_DIR + '/uploads';

app.use(function (req, res, next) {
	res.json = res.json.bind(res);
	res.catch = function (err) {
		res.status(500);
		if (req.xhr && err.message) {
			res.json({message: err.message});
		}
		else {
			res.send();
		}
	};

	next();
});