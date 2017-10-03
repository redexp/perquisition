define('views/rooms-list', [
	'view',
	'spreadcast'
], function (
	View,
	spreadcast
) {

	function RoomsList() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: RoomsList,

		data: function () {
			return {
				list: []
			};
		},

		template: {
			'[data-list]': {
				each: {
					prop: 'list',
					view: Room,
					dataProp: 'room'
				}
			}
		}
	});

	function Room() {
		View.apply(this, arguments);

		var room = this.model('room');
		var stream = new spreadcast.Room({name: room.get('id'), url: 'wss://' + location.hostname + ':8200'});
		room.set('stream', stream);

		var channels = room.model('channels');

		stream.onAddStream = function (video, id) {
			channels.add({
				id: id,
				video: video
			});
		};

		stream.onRemoveStream = function (video, id) {
			var channel = channels.find(function (channel) {
				return channel.id === id;
			});

			channels.remove(channel);
		};
	}

	View.extend({
		constructor: Room,

		ui: {
			video: '[data-stream-video]'
		},

		startStream: function () {
			var view = this;

			this.data.room.stream
				.publish({
					video: {
						width: 320,
						height: 240,
						frameRate: 24
					}
				})
				.then(function(video) {
					view.ui.video.append(video);
				})
				.catch(function(error) {
					console.error(error);
				})
			;
		},

		template: {
			'[data-room-title]': {
				text: '=room.id'
			},

			'[data-channels]': {
				each: {
					prop: 'room.channels',
					view: Channel,
					dataProp: 'channel'
				},
				visible: {
					'@room.channels': function (list) {
						return list.length > 0;
					}
				}
			},

			'[data-empty]': {
				visible: {
					'@room.channels': function (list) {
						return list.length === 0;
					}
				}
			},

			'[data-start-stream]': {
				click: 'startStream'
			}
		}
	});

	function Channel() {
		View.apply(this, arguments);

		this.ui.video.append(this.data.channel.video);
	}

	View.extend({
		constructor: Channel,

		ui: {
			video: '[data-video]'
		},

		template: {
			
		}
	});

	return RoomsList;
});