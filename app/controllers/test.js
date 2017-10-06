var route = require('express').Router();

module.exports = route;

var id = 0;

route.get('/', function (req, res) {
	id++;
	res.serverData.user = {id: id, name: 'Student ' + id, is_admin: false};
	res.serverData.course = {id: 1, title: 'JavaScript course 2017'};
	res.render('student/chat');
});

// 178.62.235.179