var chat = require('express').Router();
var User = require('app/models/user');
var Message = require('app/models/message');
var faye = require('app/lib/faye');
var fayeClient = faye.getClient();
var pick = require('lodash/pick');
var toArray = require('lodash/toArray');
var moment = require('moment');
var uuid = require('uuid').v4;

module.exports = chat;

chat.get('/', function (req, res) {
	var user = req.user;
	var course = req.course;
	var token = getChatUserToken(course.id, user.id) || uuid();

	addChatUser(course.id, token, user);

	res.serverData.user = Object.assign(pick(user, ['id', 'name']), {
		is_teacher: user.hasRole('teacher'),
		token: token
	});
	res.serverData.course = pick(course, ['id', 'title', 'video_url', 'chat_enabled']);

	getChatUsers(course.id)
		.then(function (users) {
			res.serverData.users = users.map(function (user) {
				return pick(user, ['id', 'name', 'photo']);
			});
		})
		.then(function () {
			return Message.getTodayMessages({course_id: course.id});
		})
		.then(function (messages) {
			res.serverData.messages = messages;
		})
		.then(function () {
			res.render('student/chat');
		})
	;
});

var chatUsers = {};
var chatMessages = [];
var messageChannel = /^\/course\/chat\/message\/\d+$/;
var pingChannel = '/course/chat/ping';

faye.addExtension({
	incoming: function (event, cb) {
		if (!messageChannel.test(event.channel)) {
			cb(event);
			return;
		}

		var token = event.ext && event.ext.token;

		if (
			!token ||
			!chatUsers[token]
		) {
			event.error = '403::Token required';
			cb(event);
			return;
		}

		var user = chatUsers[token];
		var message = event.data;

		message.user_id = user.id;
		message.course_id = user.courseId;
		message.time = moment.utc().format('YYYY-MM-DD HH:mm:ss Z');

		chatMessages.push(message);

		cb(event);
	}
});

faye.addExtension({
	incoming: function (event, cb) {
		if (event.channel !== pingChannel) {
			cb(event);
			return;
		}

		var token = event.ext && event.ext.token;

		if (
			!token ||
			!chatUsers[token]
		) {
			event.error = '403::Token required';
			cb(event);
			return;
		}

		chatUsers[token].time = Date.now();

		cb(event);
	}
});

setInterval(removeOfflineChatUsers, 1000);
setInterval(saveChatMessages, 2000);

function addChatUser(courseId, token, user) {
	fayeClient.publish('/course/chat/user/' + courseId, {
		type: 'add-user',
		user: pick(user, ['id', 'name', 'photo'])
	});

	chatUsers[token] = {
		id: user.id,
		courseId: courseId,
		time: Date.now()
	};
}

function removeChatUser(token) {
	var user = chatUsers[token];

	fayeClient.publish('/course/chat/user/' + user.courseId, {
		type: 'remove-user',
		user_id: Number(user.id)
	});
}

function getChatUserToken(courseId, id) {
	for (var token in chatUsers) {
		var user = chatUsers[token];

		if (user.courseId === courseId && user.id === id) return token;
	}
}

function getChatUsers(courseId) {
	var ids = [];

	for (var token in chatUsers) {
		var user = chatUsers[token];

		if (user.courseId === courseId) {
			ids.push(user.id);
		}
	}

	return ids.length > 0 ? User.findAll({where: {id: {$in: ids}}}) : Promise.resolve([]);
}

function removeOfflineChatUsers() {
	var now = Date.now();

	for (var token in chatUsers) {
		var user = chatUsers[token];

		if (now - user.time > 10000) {
			removeChatUser(token);
		}

		if (now - user.time > 30000) {
			delete chatUsers[token];
		}
	}
}

function saveChatMessages() {
	if (chatMessages.length === 0) return;

	Message.saveAll(chatMessages).catch(function (err) {
		console.error(err);
	});
	chatMessages = [];
}