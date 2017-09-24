define('views/course-form', [
	'view',
	'views/modal-form',
	'views/autocompleter',
	'serverData',
	'utils',
	'lang',
	'jquery'
], function (
	View,
	ModalForm,
	Autocompleter,
	serverData,
	utils,
	__,
	$
) {

	function CourseForm(options) {
		var form = this;

		this.userAutocompleter = new Autocompleter({
			node: $(options.node).find('[data-user_autocompleter]'),
			titleProp: 'name',
			getList: function (query) {
				query.exclude = form.data.users
					.map(function (user) {
						return user.id;
					})
					.filter(function (id) {
						return !!id;
					});

				return form.callbacks.getUsersList(query);
			}
		});

		this.teamAutocompleter = new Autocompleter({
			node: $(options.node).find('[data-team_autocompleter]'),
			titleProp: 'name',
			getList: function (query) {
				query.exclude = form.data.teams
					.map(function (user) {
						return user.id;
					})
					.filter(function (id) {
						return !!id;
					});

				return form.callbacks.getTeamsList(query);
			}
		});

		ModalForm.apply(this, arguments);

		this.on('open', function (params) {
			var course = params.course || CourseForm.prototype.data().course;

			this.model('course').set(course);
			this.assign({
				users: [],
				teams: []
			});

			var form = this;

			if (course.id) {
				this.callbacks.getCourseUsers(course).then(function (users) {
					form.model('users').reset(users.map(function (user) {
						return {
							id: user.id,
							name: user.name,
							read: !!course.users_permissions[user.id].read,
							write: !!course.users_permissions[user.id].write,
							pass: !!course.users_permissions[user.id].pass
						};
					}));
				});

				this.callbacks.getCourseTeams(course).then(function (teams) {
					form.model('teams').reset(teams.map(function (team) {
						return {
							id: team.id,
							name: team.name,
							read: !!course.teams_permissions[team.id].read,
							write: !!course.teams_permissions[team.id].write,
							pass: !!course.teams_permissions[team.id].pass
						};
					}));
				});
			}
		});

		this.on('validate', function (data, errors) {
			if (!data.title.trim()) {
				errors.push('[data-course_title_required]');
			}

			this.model('users').views.forEach(function (view) {
				view.trigger('validate', view.data.user, errors);
			});

			this.model('teams').views.forEach(function (view) {
				view.trigger('validate', view.data.team, errors);
			});
		});

		this.on('save', function (data) {
			data.users_permissions = this.data.users.reduce(function (hash, item) {
				hash[item.id] = {
					read: item.read,
					write: item.write,
					pass: item.pass
				};
				return hash;
			}, {});
			data.teams_permissions = this.data.teams.reduce(function (hash, item) {
				hash[item.id] = {
					read: item.read,
					write: item.write,
					pass: item.pass
				};
				return hash;
			}, {});
		});
	}

	ModalForm.extend({
		constructor: CourseForm,

		data: function () {
			return {
				course: {
					title: ''
				},
				users: [],
				teams: []
			};
		},

		addUser: function () {
			this.model('users').add({
				id: '',
				name: '',
				read: false,
				write: false,
				pass: false
			});
		},

		removeUser: function (user) {
			this.model('users').remove(user);
		},

		openUserAutocompleter: function (user) {
			var users = this.model('users'),
				model = users.modelOf(user),
				view = users.views.viewOf(user);

			this.userAutocompleter.open({
				input: view.ui.nameInput,
				change: function (newUser) {
					model.set({
						id: newUser.id,
						name: newUser.name
					});
				}
			});
		},

		addTeam: function () {
			this.model('teams').add({
				id: '',
				name: '',
				read: false,
				write: false,
				pass: false
			});
		},

		removeTeam: function (team) {
			this.model('teams').remove(team);
		},

		openTeamAutocompleter: function (team) {
			var teams = this.model('teams'),
				model = teams.modelOf(team),
				view = teams.views.viewOf(team);

			this.teamAutocompleter.open({
				input: view.ui.nameInput,
				change: function (newTeam) {
					model.set({
						id: newTeam.id,
						name: newTeam.name
					});
				}
			});
		},

		template: {
			'[name="title"]': {
				prop: {
					'value': '@course.title'
				}
			},

			'[data-users]': {
				'& [data-list]': {
					each: {
						prop: 'users',
						view: User,
						dataProp: 'user'
					}
				},

				'& [data-add_user]': {
					on: {
						'click': 'addUser'
					}
				}
			},
			'[data-teams]': {
				'& [data-list]': {
					each: {
						prop: 'teams',
						view: Team,
						dataProp: 'team'
					}
				},

				'& [data-add_team]': {
					on: {
						'click': 'addTeam'
					}
				}
			}
		}
	});

	function User() {
		View.apply(this, arguments);

		this.on('validate', function (data, errors) {
			if (!data.id) {
				errors.push({
					node: this.node.find('[data-user_required]')
				});
			}
		});
	}

	View.extend({
		constructor: User,

		ui: {
			nameInput: '[data-user_name_input]'
		},

		removeUser: function () {
			this.parent.removeUser(this.data.user);
		},

		openAutocompleter: function () {
			this.parent.openUserAutocompleter(this.data.user);
		},

		template: {
			'[data-user_name]': {
				text: '@user.name',
				hidden: '!@user.id'
			},

			'[data-user_name_input]': {
				on: {
					'click': 'openAutocompleter'
				},

				visible: '!@user.id'
			},

			'[data-permission="read"]': {
				connect: {
					'checked': 'user.read'
				}
			},

			'[data-permission="write"]': {
				connect: {
					'checked': 'user.write'
				}
			},

			'[data-permission="pass"]': {
				connect: {
					'checked': 'user.pass'
				}
			},

			'[data-remove_user]': {
				on: {
					'click': 'removeUser'
				}
			}
		}
	});

	function Team() {
		View.apply(this, arguments);

		this.on('validate', function (data, errors) {
			if (!data.id) {
				errors.push({
					node: this.node.find('[data-team_required]')
				});
			}
		});
	}

	View.extend({
		constructor: Team,

		ui: {
			nameInput: '[data-team_name_input]'
		},

		removeTeam: function () {
			this.parent.removeTeam(this.data.team);
		},

		openAutocompleter: function () {
			this.parent.openTeamAutocompleter(this.data.team);
		},

		template: {
			'[data-team_name]': {
				text: '@team.name',
				hidden: '!@team.id'
			},

			'[data-team_name_input]': {
				on: {
					'click': 'openAutocompleter'
				},

				visible: '!@team.id'
			},

			'[data-permission="read"]': {
				connect: {
					'checked': 'team.read'
				}
			},

			'[data-permission="write"]': {
				connect: {
					'checked': 'team.write'
				}
			},

			'[data-permission="pass"]': {
				connect: {
					'checked': 'team.pass'
				}
			},

			'[data-remove_team]': {
				on: {
					'click': 'removeTeam'
				}
			}
		}
	});

	return CourseForm;
});