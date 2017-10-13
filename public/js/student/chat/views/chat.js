define('views/chat', [
	'view',
	'views/video',
	'views/message',
	'views/user',
	'htmlToText',
	'jquery'
], function (
	View,
	Video,
	Message,
	User,
	htmlToText,
	$
) {

	function Chat() {
		View.apply(this, arguments);
		this.callbacks = {};

		this.body = $(document.body);

		var usersWidth = 300;

		this.on('set/usersVisible', function (visible) {
			this.set('videosWidth', this.data.videosWidth + (visible ? -1 : 1) * usersWidth);
		});

		var videosWidth = this.body.width() - 800;

		if (videosWidth < 600) {
			videosWidth = 600;
		}

		this.set('videosWidth', videosWidth);

		this.scrollToBottom();

		this.on('@chatEnabled', function (enabled) {
			if (!enabled) {
				this.ui.textarea.blur();
			}
		});
	}

	View.extend({
		constructor: Chat,

		ui: {
			videos: '[data-block="videos"]',
			divider: '[data-divider]',
			textarea: '[data-textarea]',
			users: '[data-block="users"]',
			messagesBlock: '[data-messages-block]'
		},

		data: function () {
			return {
				stream: '',
				videos: [],
				messages: [],
				users: [],
				videosWidth: 600,
				resizing: false,
				videosVisible: false,
				chatVisible: true,
				usersVisible: true,
				chatEnabled: true
			};
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

		addMessage: function () {
			var text = htmlToText(this.ui.textarea);
			this.callbacks.addMessage(text);
			this.ui.textarea.empty();
		},

		scrollToBottom: function () {
			this.ui.messagesBlock.scrollTop(this.ui.messagesBlock.prop('scrollHeight'));
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
					'min-width': {
						'@videosWidth set/chatVisible': function () {
							return this.data.chatVisible ? this.data.videosWidth : 'auto';
						}
					}
				},
				toggleClass: {
					'full-width': '!@chatVisible'
				}
			},

			'[data-stream]': {
				visible: '@stream',
				attr: {
					'src': '@stream'
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
					'@videosVisible set/chatVisible': function () {
						return this.data.videosVisible && this.data.chatVisible;
					}
				}
			},

			'[data-messages]': {
				each: {
					prop: 'messages',
					view: Message,
					dataProp: 'message',
					dataIndexProp: 'index',
					removeClass: 'hidden',
					add: function (div, item) {
						var block = this.ui.messagesBlock;
						var scroll = block.scrollTop() + block.height() + 50 >= block.prop('scrollHeight');

						div.append(item.node);

						if (scroll) {
							this.scrollToBottom();
						}
					}
				}
			},

			'[data-chat-disabled]': {
				visible: '!@chatEnabled'
			},

			'[data-textarea]': {
				on: {
					'keydown': function (e) {
						if (e.keyCode === 13 && (e.ctrlKey || e.shiftKey)) {
							e.preventDefault();

							this.addMessage();
						}
					}
				}
			},

			'[data-add-message]': {
				click: 'addMessage'
			},

			'[data-users]': {
				each: {
					prop: 'users',
					view: User,
					dataProp: 'user',
					removeClass: 'hidden'
				}
			}
		}
	});

	return Chat;
});