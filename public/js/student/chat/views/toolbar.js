define('views/toolbar', [
	'view'
], function (
	View
) {

	function Toolbar() {
		View.apply(this, arguments);
		this.callbacks = {};
	}

	View.extend({
		constructor: Toolbar,

		data: {
			videos: true,
			chat: true,
			users: true
		},

		template: {
			'[data-start-camera]': {
				click: function () {
					this.callbacks.startCamera();
				}
			},
			'[data-start-screen]': {
				click: function () {
					this.callbacks.startScreen();
				}
			},

			'[data-view]': {
				click: function (e) {
					var name = e.currentTarget.getAttribute('data-view');
					this.set(name, !this.data[name]);
					this.trigger('change', name, this.data[name]);
					this.callbacks.toggleView(name, this.data[name]);
				},
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