define('controllers/chat', [
	'views/toolbar',
	'views/chat',
	'fayeClient',
	'store',
	'uuid',
	'moment',
	'serverData',
	'ajax'
], function (
	Toolbar,
	Chat,
	fayeClient,
	store,
	uuid,
	moment,
	serverData,
	ajax
) {

	var course = store.course;
	var user = store.user;

	var toolbar = new Toolbar({
		node: '#toolbar',
		data: {
			title: course.title,
			videoURL: course.video_url,
			mode: store.IS_MOBILE ? 'radio' : 'checkbox',
			videos: false,
			chat: true,
			users: !store.IS_MOBILE,
			videoEnabled: user.is_teacher,
			chatEnabled: course.chat_enabled
		}
	});

	store.users.forEach(function (item) {
		item.videoEnabled = false;
		item.chatEnabled = toolbar.data.chatEnabled;
	});

	toolbar.callbacks.startCamera = function () {
		var room = createRoom();

		room.publish({video: {width: 600, height: 400}}, 'camera').then(function (video) {
			toolbar.set('videos', true);

			videos.add({
				id: 'camera',
				videoNode: video
			});
		});
	};

	toolbar.callbacks.toggleView = function (name, state) {
		chat.set(name + 'Visible', state);
	};

	toolbar.callbacks.disableChat = function () {
		toolbar.set('chatEnabled', false);
		users.forEach(function (user) {
			users.modelOf(user).set('chatEnabled', false);
		});
		ajax('/teacher/courses/chat-enabled', {id: course.id, enabled: false});
	};

	toolbar.callbacks.enableChat = function () {
		toolbar.set('chatEnabled', true);
		users.forEach(function (user) {
			users.modelOf(user).set('chatEnabled', true);
		});
		ajax('/teacher/courses/chat-enabled', {id: course.id, enabled: true});
	};

	var chat = new Chat({
		node: '#chat',
		data: {
			users: store.users,
			messages: serverData('messages'),
			videosVisible: toolbar.data.videos,
			chatVisible: toolbar.data.chat,
			usersVisible: toolbar.data.users,
			chatEnabled: user.is_teacher || course.chat_enabled
		}
	});

	var videos = chat.model('videos');
	var messages = chat.model('messages');
	var users = chat.model('users');

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

	chat.callbacks.enableUserChat = function (user) {
		fayeClient.publish('/course/chat/user/' + course.id, {type: 'enable-chat', user_id: user.id});
		chat.model('users').modelOf(user).set('chatEnabled', true);
	};

	chat.callbacks.disableUserChat = function (user) {
		fayeClient.publish('/course/chat/user/' + course.id, {type: 'disable-chat', user_id: user.id});
		chat.model('users').modelOf(user).set('chatEnabled', false);
	};

	chat.callbacks.enableUserVideo = function (user) {
		fayeClient.publish('/course/chat/user/' + course.id, {type: 'enable-video', user_id: user.id});
		chat.model('users').modelOf(user).set('videoEnabled', true);
		createRoom();
	};

	chat.callbacks.disableUserVideo = function (user) {
		fayeClient.publish('/course/chat/user/' + course.id, {type: 'disable-video', user_id: user.id});
		chat.model('users').modelOf(user).set('videoEnabled', false);
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
				e.user.chatEnabled = course.chat_enabled;
				users.add(e.user);
			}
			break;
		case 'remove-user':
			users.remove(users.findWhere({id: e.user_id}));
			break;
		case 'enable-video':
			if (e.user_id === user.id) {
				toolbar.set('videoEnabled', true);
			}
			break;
		case 'disable-video':
			if (e.user_id === user.id && !user.is_teacher) {
				toolbar.set('videoEnabled', false);
				toolbar.set('videos', false);
				if (createRoom.room) {
					createRoom.room.stop();
					createRoom.room = null;
				}
			}
			break;
		case 'enable-chat':
			if (e.user_id === user.id) {
				chat.set('chatEnabled', true);
			}
			break;
		case 'disable-chat':
			if (e.user_id === user.id && !user.is_teacher) {
				chat.set('chatEnabled', false);
			}
			break;
		case 'chat-enabled':
			if (!user.is_teacher) {
				chat.set('chatEnabled', e.enabled);
			}
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

	function createRoom() {
		if (createRoom.room) return createRoom.room;

		var spreadcast = require('spreadcast');

		var room = createRoom.room = new spreadcast.Room({
			name: course.id,
			url: 'wss://' + location.hostname + ':8200'
		});

		room.onAddStream = function (videoNode, id) {
			toolbar.set('videos', true);

			videos.add({
				id: id,
				videoNode: videoNode
			});
		};

		room.onRemoveStream = function (videoNode, id) {
			var video = videos.findWhere({id: id});

			videos.remove(video);
		};

		return room;
	}
});