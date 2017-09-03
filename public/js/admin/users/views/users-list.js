define('views/users-list', [
	'view',
	'jquery'
], function (
	View,
	$
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
			'[data-list]': {
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

		deleteUser: function () {
			this.parent.callbacks.deleteUser(this.data.user);
		},

		template: {
			'[data-name]': {
				text: '@user.name'
			},
			'[data-username]': {
				text: '@user.username'
			},

			'[data-role]': {
				visible: {
					'@user.roles': function (roles) {
						return function (node) {
							return roles.indexOf(node.attr('data-role')) > -1;
						};
					}
				}
			},

			'[data-teams]': {
				each: {
					prop: 'user.teams',
					view: Team
				}
			},

			'[data-edit]': {
				on: {
					'click': 'editUser'
				}
			},

			'[data-delete]': {
				on: {
					'click': 'deleteUser'
				}
			}
		}
	});

	function Team() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Team,

		template: {
			'[data-name]': {
				text: '=name',
				attr: {
					'href': function () {
						return '/admin/teams?' + $.param({name: this.data.name, role: this.data.role});
					}
				}
			}
		}
	});

	return UsersList;
});