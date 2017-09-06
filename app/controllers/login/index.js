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