define('views/users-toolbar', [
	'view'
], function (
	View
) {

	function UsersToolbar() {
		View.apply(this, arguments);

		this.callbacks = {};
	}

	View.extend({
		constructor: UsersToolbar,

		addUser: function () {
			this.callbacks.addUser();
		},

		template: {
			'[data-add_user]': {
				on: {
					'click': 'addUser'
				}
			}
		}
	});

	return UsersToolbar;
});