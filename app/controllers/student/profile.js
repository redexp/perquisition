var app = require('app');
var profile = require('express').Router();
var pick = require('lodash/pick');

module.exports = profile;

profile.get('/', function (req, res) {
	res.serverData.user = pick(req.user, ['id', 'username', 'name', 'photo']);
	res.render('student/profile');
});

var PHOTOS_DIR = app.UPLOADS_DIR + '/photos';

var uploader = require('multer')({
	storage: require('multer').diskStorage({
		destination: PHOTOS_DIR
	})
});

var fs = require('fs');

profile.post('/', uploader.single('photo'), function (req, res) {
	var user = req.user;
	var data = req.body;
	var file = req.file;

	if (data.name.trim()) {
		user.name = data.name.trim();
	}

	if (data.password) {
		user.password = user.generatePassword(data.password);
	}

	if (file) {
		if (user.photo && fs.existsSync(PHOTOS_DIR + '/' + user.photo)) {
			fs.unlinkSync(PHOTOS_DIR + '/' + user.photo);
		}

		fs.renameSync(file.path, file.path + '.png');
		user.photo = file.filename + '.png';
	}

	user.save().then(res.json, res.catch);
});