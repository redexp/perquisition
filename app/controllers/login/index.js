var login = require('express').Router();
var passport = require('app/lib/passport');

login.post('/', passport.authenticate('local'), function (req, res) {
	res.json({id: req.user.id});
});

module.exports = login;