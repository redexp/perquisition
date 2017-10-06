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
			canStartVideo: true,
			mode: 'checkbox',
			videos: true,
			chat: true,
			users: false
		},

		toggleView: function (e) {
			e.preventDefault();
			var name = e.currentTarget.getAttribute('data-view');
			this.set(name, !this.data[name]);
		},

		template: {
			'[data-title]': {
				text: '@title'
			},

			'[data-start-camera]': {
				click: function () {
					this.callbacks.startCamera();
				},
				visible: '@canStartVideo'
			},
			'[data-start-screen]': {
				click: function () {
					this.callbacks.startScreen();
				},
				visible: '@canStartVideo'
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
			}
		}
	});

	return Toolbar;
});