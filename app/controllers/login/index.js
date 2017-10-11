var app = require('app');
var auth = require('express').Router();
var passport = require('app/lib/passport');

module.exports = auth;

auth.post('/login', passport.authenticate('local'), function (req, res) {
	res.json({id: req.user.id});
});

auth.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

auth.get('/registration', function (req, res) {
	res.render('login/registration');
});

var User = require('app/models/user');
var fs = require('fs');
var uuid = require('uuid').v4;
var gmail = require('app/lib/gmail');

var PHOTOS_DIR = app.UPLOADS_DIR + '/photos';

var uploader = require('multer')({
	storage: require('multer').diskStorage({
		destination: PHOTOS_DIR
	})
});

auth.post('/registration', validateEmail, uploader.single('photo'), function (req, res) {
	var data = req.body;
	var file = req.file;
	var errors = [];

	if (!/^.+@.+\..+$/.test(data.username)) {
		errors.push('Email not valid');
	}
	if (!data.password.trim()) {
		errors.push('Password required');
	}
	if (!data.name.trim()) {
		errors.push('Name required');
	}
	if (!file) {
		errors.push('Photo required');
	}
	if (errors.length > 0) {
		if (file) {
			fs.unlinkSync(file.path);
		}

		res.status(500).json({message: errors.join('<br/>')});
		return;
	}

	fs.renameSync(file.path, file.path + '.png');

	var user = User.build(data);
	user.roles = ['student'];
	user.username = user.username.toLowerCase().trim();
	user.password = user.generatePassword(data.password);
	user.photo = file.filename + '.png';
	user.verification_code = uuid();
	user.verified = false;

	user
		.save()
		.then(function () {
			var teams = JSON.parse(fs.readFileSync(app.UPLOADS_DIR + '/teams.json').toString());
			var ids = [];

			for (var id in teams) {
				var users = teams[id];

				if (users.indexOf(user.username) > -1) {
					ids.push(id);
				}
			}

			if (ids.length) {
				return user.setTeams(ids);
			}
		})
		.then(function () {
			var url = `https://online.geekhub.ck.ua/registration/` + user.verification_code;
			return gmail({
				from: 'GeekHub Online',
				to: user.username,
				subject: 'Verify you email on GeekHub Online',
				text: `Link to verify your email ${url}`,
				html: `Click on link to verify your email <a href="${url}">${url}</a>`
			});
		})
		.then(function () {
			return user;
		})
		.then(res.json)
		.catch(function (err) {
			res.status(500).json({message: err.message});
		})
	;
});

auth.get('/registration/:uuid', function (req, res) {
	User.findOne({where: {verification_code: req.params.uuid}})
		.then(function (user) {
			if (!user) throw new Error('User not found');
			user.verified = true;
			return user.save();
		})
		.then(function () {
			res.redirect('/?verified');
		})
		.catch(function () {
			res.redirect('/?rejected');
		})
	;
});

function validateEmail(req, res, next) {
	User.findOne({where: {username: String(req.body.username).toLowerCase().trim()}}).then(function (user) {
		if (user) {
			res.status(500).json({message: 'User with same email already registered'});
		}
		else {
			next();
		}
	});
}