define('views/teams-list', [
	'view'
], function (
	View
) {

	function TeamsList() {
		View.apply(this, arguments);

		this.callbacks = {};
	}

	View.extend({
		constructor: TeamsList,

		data: function () {
			return {
				list: []
			};
		},

		template: {
			'[data-list]': {
				each: {
					prop: 'list',
					view: Team,
					dataProp: 'team'
				}
			}
		}
	});

	function Team() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Team,

		editTeam: function () {
			this.parent.callbacks.editTeam(this.data.team);
		},

		deleteTeam: function () {
			this.parent.callbacks.deleteTeam(this.data.team);
		},

		template: {
			'[data-name]': {
				text: '@team.name'
			},

			'[data-role]': {
				visible: {
					'@team.role': function (role) {
						return function (node) {
							return node.attr('data-role') === role;
						};
					}
				}
			},

			'[data-users_count]': {
				text: '@team.users_count'
			},

			'[data-edit]': {
				on: {
					'click': 'editTeam'
				}
			},

			'[data-delete]': {
				on: {
					'click': 'deleteTeam'
				}
			}
		}
	});

	return TeamsList;
});