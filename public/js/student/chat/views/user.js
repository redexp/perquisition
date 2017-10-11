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
		}
	});

	return User;
});