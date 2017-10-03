var app = require('app');
var stream = require('express').Router();

module.exports = stream;

stream.get('/', function (req, res) {
	res.render('student/stream');
});