define('controllers/chat', [
	'views/toolbar',
	'views/chat',
	'spreadcast',
	'webrtc',
	'fayeClient',
	'store',
	'uuid',
	'moment',
	'serverData'
], function (
	Toolbar,
	Chat,
	spreadcast,
	webrtc,
	fayeClient,
	store,
	uuid,
	moment,
	serverData
) {

	var course = store.course;
	var user = store.user;

	var room = new spreadcast.Room({
		name: course.id,
		url: 'wss://' + location.hostname + ':8200'
	});

	var toolbar = new Toolbar({
		node: '#toolbar',
		data: {
			title: course.title,
			canStartVideo: user.is_teacher,
			mode: store.IS_MOBILE ? 'radio' : 'checkbox',
			chat: !store.IS_MOBILE
		}
	});

	toolbar.callbacks.startCamera = function () {
		room.publish({video: {width: 600, height: 400}}, 'camera').then(function (video) {
			videos.add({
				id: 'camera',
				videoNode: video
			});
		});
	};

	toolbar.callbacks.startScreen = function () {
		webrtc.getScreenId(function (err, sourceId, params) {
			if (err) {
				console.error(err);
				return;
			}

			room.publish(params, 'screen').then(function (video) {
				videos.add({
					id: 'screen',
					videoNode: video
				});
			});
		});
	};

	toolbar.callbacks.toggleView = function (name, state) {
		chat.set(name + 'Visible', state);
	};

	var chat = new Chat({
		node: '#chat',
		data: {
			chatVisible: !store.IS_MOBILE,
			users: store.users
		}
	});

	var videos = chat.model('videos');
	var messages = chat.model('messages').reset(serverData('messages'));
	var users = chat.model('users');

	room.onAddStream = function (video, id) {
		videos.add({
			id: id,
			videoNode: video
		});
	};

	room.onRemoveStream = function (video, id) {
		var video = videos.find(function (video) {
			return video.id === id;
		});

		videos.remove(video);
	};

	chat.callbacks.stopVideo = function (video) {
		room.stopStream(video.id);
		chat.model('videos').remove(video);
	};

	chat.callbacks.addMessage = function (text) {
		var message = {
			uuid: uuid(),
			user_name: user.name,
			time: now(),
			text: text
		};

		messages.add(message);

		fayeClient.publish('/course/chat/message/' + course.id, message);
	};

	fayeClient.subscribe('/course/chat/user/' + course.id, function (e) {
		switch (e.type) {
		case 'message':
			if (!messages.findWhere({uuid: e.message.uuid})) {
				messages.add(e.message);
			}
			break;
		case 'add-user':
			if (!users.findWhere({id: e.user.id})) {
				users.add(e.user);
			}
			break;
		case 'remove-user':
			users.remove(users.findWhere({id: e.user_id}));
			break;
		}
	});

	fayeClient.subscribe('/course/chat/message/' + course.id, function (message) {
		if (!messages.findWhere({uuid: message.uuid})) {
			messages.add(message);
		}
	});

	setInterval(ping, 5000);

	function now() {
		return moment.utc().format('YYYY-MM-DD HH:mm:ss');
	}

	function ping() {
		fayeClient.publish('/course/chat/ping', {});
	}
});