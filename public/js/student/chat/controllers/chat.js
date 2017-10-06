define('controllers/chat', [
	'views/toolbar',
	'views/chat',
	'spreadcast',
	'webrtc',
	'store'
], function (
	Toolbar,
	Chat,
	spreadcast,
	webrtc,
	store
) {

	var course = store.course;

	var room = new spreadcast.Room({
		name: course.chat.id,
		url: 'wss://' + location.hostname + ':8200'
	});

	var toolbar = new Toolbar({
		node: '#toolbar'
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
		node: '#chat'
	});

	var videos = chat.model('videos');

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

	videos.add([
		{id: 1, videoNode: jQuery('<video>')},
		{id: 2, videoNode: jQuery('<video>')}
	]);
});