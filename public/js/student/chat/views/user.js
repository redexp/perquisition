define('views/user', [
	'view'
], function (
	View
) {

	function User() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: User,

		enableVideo: function () {
			this.parent.callbacks.enableUserVideo(this.data.user);
		},

		disableVideo: function () {
			this.parent.callbacks.disableUserVideo(this.data.user);
		},

		template: {
			'[data-name]': {
				text: '=user.name'
			},
			'[data-photo]': {
				attr: {
					'src': function () {
						return '/student/photo/' + this.data.user.photo;
					}
				}
			},
			'[data-enable-video]': {
				visible: '!@user.videoEnabled',
				click: 'enableVideo'
			},
			'[data-disable-video]': {
				visible: '@user.videoEnabled',
				click: 'disableVideo'
			}
		}
	});

	return User;
});