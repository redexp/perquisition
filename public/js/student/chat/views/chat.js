define('views/chat', [
	'view',
	'views/video',
	'jquery'
], function (
	View,
	Video,
	$
) {

	function Chat() {
		View.apply(this, arguments);
		this.callbacks = {};

		this.body = $(document.body);

		var usersWidth = this.ui.users.width();
		this.on('set/usersVisible', function (visible) {
			this.set('videosWidth', this.data.videosWidth + (visible ? -1 : 1) * usersWidth);
		});
	}

	View.extend({
		constructor: Chat,

		ui: {
			videos: '[data-block="videos"]',
			divider: '[data-divider]',
			textarea: '[data-textarea]',
			users: '[data-block="users"]'
		},

		data: function () {
			return {
				videos: [],
				messages: [],
				users: [],
				videosWidth: 600,
				resizing: false,
				videosVisible: true,
				chatVisible: true,
				usersVisible: true
			};
		},

		startCamera: function () {
			this.callbacks.startCamera();
		},

		startScreen: function () {
			this.callbacks.startScreen();
		},

		startResizing: function (e) {
			this.dividerOffset = e.pageX - this.ui.divider.offset().left;

			this.listenOn(this.body, 'mousemove.resizing', this.resizing);
			this.listenOn(this.body, 'mouseup.resizing', this.stopResizing);
			this.set('resizing', true);
		},

		resizing: function (e) {
			this.set('videosWidth', e.pageX - this.dividerOffset);
		},

		stopResizing: function () {
			this.stopListening(this.body, 'mousemove.resizing');
			this.stopListening(this.body, 'mouseup.resizing');
			this.set('resizing', false);
		},

		template: {
			'@root': {
				toggleClass: {
					'resizing': '@resizing'
				}
			},

			'[data-block]': {
				visible: {
					'= set/videosVisible set/chatVisible set/usersVisible': function () {
						return function (node) {
							return this.data[node.attr('data-block') + 'Visible'];
						};
					}
				}
			},

			'[data-block="videos"]': {
				style: {
					'height': '@videosHeight',
					'width': {
						'@videosWidth set/chatVisible': function () {
							return this.data.chatVisible ? this.data.videosWidth : 'auto';
						}
					}
				},
				toggleClass: {
					'full-width': '!@chatVisible'
				}
			},

			'[data-videos]': {
				each: {
					prop: 'videos',
					view: Video,
					dataProp: 'video'
				}
			},

			'[data-divider]': {
				on: {
					'mousedown': 'startResizing'
				},
				visible: {
					'set/videosVisible set/chatVisible': function () {
						return this.data.videosVisible && this.data.chatVisible;
					}
				}
			},

			'[data-messages-block]': {
				style: {
					'height': '@messagesHeight'
				}
			}
		}
	});

	return Chat;
});