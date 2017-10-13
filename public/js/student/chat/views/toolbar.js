define('views/toolbar', [
	'view'
], function (
	View
) {

	var views = ['videos', 'chat', 'users'];

	function Toolbar() {
		View.apply(this, arguments);
		this.callbacks = {};

		this.on('set', function (name, value) {
			if (views.indexOf(name) === -1) return;

			this.trigger('change');
			this.callbacks.toggleView(name, value);

			if (this.data.mode === 'radio' && value) {
				var self = this;
				views.forEach(function (view) {
					if (view === name) return;

					self.set(view, false);
				});
			}
		});
	}

	View.extend({
		constructor: Toolbar,

		data: {
			title: '',
			videoURL: '',
			videoEnabled: false,
			chatEnabled: false,
			mode: 'checkbox',
			videos: false,
			chat: true,
			users: true
		},

		toggleView: function (e) {
			e.preventDefault();
			var name = e.currentTarget.getAttribute('data-view');
			this.set(name, !this.data[name]);
		},

		disableChat: function () {
			this.callbacks.disableChat();
		},

		enableChat: function () {
			this.callbacks.enableChat();
		},

		template: {
			'[data-title]': {
				text: '@title'
			},

			'[data-video_url]': {
				visible: '@videoURL',
				attr: {
					'href': '@videoURL'
				}
			},

			'[data-start-camera]': {
				click: function () {
					this.callbacks.startCamera();
				},
				toggleClass: {
					'hidden': '!@videoEnabled'
				}
			},

			'[data-view]': {
				click: 'toggleView',
				toggleClass: {
					'active': {
						'= change': function () {
							return function (node) {
								return this.data[node.attr('data-view')];
							};
						}
					}
				}
			},

			'[data-disable-chat]': {
				visible: '@chatEnabled',
				click: 'disableChat'
			},

			'[data-enable-chat]': {
				visible: '!@chatEnabled',
				click: 'enableChat'
			}
		}
	});

	return Toolbar;
});