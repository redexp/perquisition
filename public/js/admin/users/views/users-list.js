define('views/users-list', [
	'view'
], function (
	View
) {

	function UsersList() {
		View.apply(this, arguments);

		this.callbacks = {};
	}

	View.extend({
		constructor: UsersList,

		data: function () {
			return {
				list: []
			};
		},

		template: {
			'@root': {
				each: {
					prop: 'list',
					view: User,
					viewProp: 'user'
				}
			}
		}
	});

	function User() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: User,

		editUser: function () {
			this.parent.callbacks.editUser(this.data.user);
		},

		template: {
			'[data-name]': {
				text: '=user.name'
			},

			'[data-role]': {
				visible: function () {
					return function (node) {
						return this.data.user.roles.indexOf(node.attr('data-role')) > -1;
					};
				}
			},

			'[data-edit]': {
				on: {
					'click': 'editUser'
				}
			}
		}
	});

	return UsersList;
});