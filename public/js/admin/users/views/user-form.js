define('views/user-form', [
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

	function UserForm(options) {
		var form = this;

		this.teamsAutocompleter = new Autocompleter({
			node: $(options.node).find('[data-team_name_autocompleter]').detach(),
			titleProp: 'name',
			getList: function (query) {
				return form.callbacks.getTeamsList(query);
			}
		});

		ModalForm.apply(this, arguments);

		this.on('open', function (params) {
			var user = params.user || UserForm.prototype.data().user;
			this.assign({
				user: user,
				password: '',
				confirm_password: '',
				teachers_teams: user.teams.filter(function (team) {
					return team.role === 'teacher';
				}),
				students_teams: user.teams.filter(function (team) {
					return team.role === 'student';
				})
			});
		});

		this.on('validate', function (data, errors) {
			if (!data.name.trim()) {
				errors.push('[data-name_required]');
			}

			if (!data.username.trim()) {
				errors.push('[data-username_required]');
			}

			if (this.data.password && this.data.password !== this.data.confirm_password) {
				errors.push('[data-password_not_equal]');
			}

			if (!this.data.user.id && !this.data.password) {
				errors.push('[data-password_required]');
			}

			if (!data.roles || !data.roles.length) {
				errors.push('[data-roles_required]');
			}
		});

		this.on('save', function (data) {
			data.id = this.data.user.id;

			if (this.data.password) {
				data.password = this.data.password;
			}

			data.teams = [].concat(this.data.teachers_teams, this.data.students_teams);
		});
	}

	ModalForm.extend({
		constructor: UserForm,

		data: function () {
			return {
				user: {
					id: '',
					name: '',
					username: '',
					roles: [],
					teams: []
				},
				password: '',
				confirm_password: '',
				teachers_teams: [],
				students_teams: []
			};
		},

		addTeachersTeam: function () {
			this.model('teachers_teams').add({
				id: null,
				name: '',
				role: 'teacher'
			});
		},

		addStudentsTeam: function () {
			this.model('students_teams').add({
				id: null,
				name: '',
				role: 'student'
			});
		},

		getTeamArrayModel: function (team) {
			return this.model(team.role === 'teacher' ? 'teachers_teams' : 'students_teams');
		},

		openTeamsAutocompleter: function (team) {
			var list = this.getTeamArrayModel(team);

			var view = list.views.viewOf(team);

			this.teamsAutocompleter.open({
				input: view.ui.teamNameInput,
				query: {
					role: team.role,
					exclude: list
						.map(function (item) {
							return item.id;
						})
						.filter(function (id) {
							return !!id;
						})
				},
				change: function (newTeam) {
					list.replace(team, newTeam);
				}
			});
		},

		removeTeam: function (team) {
			this.getTeamArrayModel(team).remove(team);
		},

		template: {
			'[name="name"]': {
				prop: {
					'value': '@user.name'
				}
			},
			'[name="username"]': {
				prop: {
					'value': '@user.username'
				}
			},

			'[data-password]': {
				connect: {
					'value': 'password'
				}
			},
			'[data-confirm_password]': {
				connect: {
					'value': 'confirm_password'
				}
			},

			'[name="roles[]"]': {
				prop: {
					'checked': {
						'@user.roles': function (roles) {
							return function (node) {
								return roles.indexOf(node.val()) > -1;
							};
						}
					}
				},

				on: {
					'change': function (e) {
						var inp = e.target;
						this.model('user').model('roles')[inp.checked ? 'add' : 'remove'](inp.value);
					}
				}
			},

			'[data-teachers_teams]': {
				visible: {
					'@user.roles': function (roles) {
						return roles.indexOf('teacher') > -1;
					}
				},

				'& [data-list]': {
					each: {
						prop: 'teachers_teams',
						view: Team,
						viewProp: 'team'
					}
				},

				'& [data-add_team]': {
					on: {
						'click': 'addTeachersTeam'
					}
				}
			},

			'[data-students_teams]': {
				visible: {
					'@user.roles': function (roles) {
						return roles.indexOf('student') > -1;
					}
				},

				'& [data-list]': {
					each: {
						prop: 'students_teams',
						view: Team,
						viewProp: 'team'
					}
				},

				'& [data-add_team]': {
					on: {
						'click': 'addStudentsTeam'
					}
				}
			}
		}
	});

	function Team() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Team,

		ui: {
			teamNameInput: '[data-team_name_input]'
		},

		data: function () {
			return {
				team: {
					id: null,
					name: '',
					role: ''
				}
			};
		},

		openAutocompleter: function () {
			this.parent.openTeamsAutocompleter(this.data.team);
		},

		removeTeam: function () {
			this.parent.removeTeam(this.data.team);
		},

		template: {
			'[data-team_name]': {
				text: '@team.name',
				hidden: '!=team.id'
			},

			'[data-team_name_input]': {
				on: {
					'click': 'openAutocompleter'
				},

				visible: '!=team.id'
			},

			'[data-remove_team]': {
				on: {
					'click': 'removeTeam'
				}
			}
		}
	});

	return UserForm;
});