define('views/team-form', [
	'views/modal-form',
	'views/autocompleter',
	'view',
	'jquery'
], function (
	ModalForm,
	Autocompleter,
	View,
	$
) {

	function TeamForm(options) {
		var form = this;

		this.usersAutocompleter = new Autocompleter({
			node: $(options.node).find('[data-user_name_autocompleter]'),
			getItemTitle: getUserName,
			getList: function (query) {
				query.name_or_username = query.value;
				delete query.value;

				query.roles = [form.data.team.role];

				query.exclude = form.data.users
					.map(function (user) {
						return user.id;
					})
					.filter(function (id) {
						return !!id;
					})
				;

				return form.callbacks.getUsersList(query);
			}
		});

		ModalForm.apply(this, arguments);

		this.on('open', function (params) {
			var team = params.team || TeamForm.prototype.data().team;
			this.assign({
				team: team,
				users: []
			});

			if (team.id) {
				var form = this;
				this.callbacks.getTeamUsers(team).then(function (users) {
					form.assign({users: users});
				});
			}
		});

		this.on('validate', function (data, errors) {
			if (!data.name.trim()) {
				errors.push('[data-name_required]');
			}

			if (!data.role) {
				errors.push('[data-role_required]');
			}

			this.model('users').views.forEach(function (view) {
				var user = view.data.user;

				if (!user.id) {
					errors.push(view.find('[data-user_required]'));
					return;
				}

				if (user.roles.indexOf(data.role) === -1) {
					errors.push(view.find('[data-not_' + data.role + ']'));
				}
			});
		});

		this.on('save', function (data) {
			data.id = this.data.team.id;
			data.users = [].concat(this.data.users);
		});
	}

	ModalForm.extend({
		constructor: TeamForm,

		data: function () {
			return {
				team: {
					id: '',
					name: '',
					role: ''
				},
				users: []
			};
		},

		addUser: function () {
			this.model('users').add({
				id: null,
				name: '',
				username: ''
			});
		},

		openUsersAutocompleter: function (user) {
			var list = this.model('users');
			var view = list.views.viewOf(user);

			this.usersAutocompleter.open({
				input: view.ui.userNameInput,
				query: {
					role: user.role,
					exclude: list
						.map(function (item) {
							return item.id;
						})
						.filter(function (id) {
							return !!id;
						})
				},
				change: function (newUser) {
					list.replace(user, newUser);
				}
			});
		},

		removeUser: function (user) {
			this.model('users').remove(user);
		},

		template: {
			'[name="name"]': {
				connect: {
					'value': 'team.name'
				}
			},

			'[name="role"]': {
				prop: {
					'checked': {
						'@team.role': function (role) {
							return function (node) {
								return node.val() === role;
							};
						}
					}
				},

				on: {
					'change': function (e) {
						var inp = e.target;
						if (inp.checked) this.model('team').set('role', inp.value);
					}
				}
			},

			'[data-users]': {
				each: {
					prop: 'users',
					view: User,
					viewProp: 'user'
				}
			},

			'[data-add_user]': {
				on: {
					'click': 'addUser'
				}
			}
		}
	});

	function User() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: User,

		ui: {
			userNameInput: '[data-user_name_input]'
		},

		data: function () {
			return {
				user: {
					id: null,
					name: '',
					username: ''
				}
			};
		},

		openAutocompleter: function () {
			this.parent.openUsersAutocompleter(this.data.user);
		},

		removeUser: function () {
			this.parent.removeUser(this.data.user);
		},

		template: {
			'[data-user_name]': {
				text: {
					'@user.name @user.username': function () {
						return getUserName(this.data.user);
					}
				},
				hidden: '!@user.id'
			},

			'[data-user_name_input]': {
				on: {
					'click': 'openAutocompleter'
				},

				visible: '!=user.id'
			},

			'[data-remove_user]': {
				on: {
					'click': 'removeUser'
				}
			}
		}
	});

	function getUserName(user) {
		return user.name + ' (' + user.username + ')';
	}

	return TeamForm;
});