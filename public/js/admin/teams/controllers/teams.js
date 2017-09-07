define('controllers/teams', [
	'views/teams-filter',
	'views/toolbar',
	'views/teams-list',
	'views/paginator',
	'views/team-form',
	'ajax',
	'notify',
	'serverData',
	'lang'
], function (
	TeamsFilter,
	Toolbar,
	TeamsList,
	Paginator,
	TeamForm,
	ajax,
	notify,
	serverData,
	__
) {

	var filterQuery = serverData('query');

	var filter = new TeamsFilter({
		node: '#filter-form',
		paginator: '#paginator',
		data: {
			name: filterQuery.name || '',
			role: [filterQuery.role || 'student']
		}
	});

	var teams = new TeamsList({
		node: '#teams-list'
	});

	filter.callbacks.save = function (data, done) {
		data.users_count = true;

		ajax('/admin/teams/search', data).then(function (res) {
			teams.model('list').reset(res.rows);
			filter.paginator.set('count', res.count);
		}).always(done);
	};

	filter.submit();

	var form = new TeamForm({
		node: '#team-form'
	});

	form.callbacks.getTeamUsers = function (team) {
		return ajax('/admin/teams/users', {id: team.id});
	};

	form.callbacks.getUsersList = function (query) {
		return ajax('/admin/users/search', query);
	};

	teams.callbacks.editTeam = function (team) {
		form.open({
			team: team,
			save: function (data) {
				return ajax('/admin/teams/update', data).then(function () {
					data.users_count = data.users.length;
					delete data.users;

					teams.modelOf(team).assign(data);
				});
			}
		});
	};

	teams.callbacks.deleteTeam = function (team) {
		notify.confirm(__('confirm_delete_team', team.name))
			.then(function () {
				return ajax('/admin/team/delete', {id: team.id});
			})
			.then(function () {
				filter.save();
			})
		;
	};

	var toolbar = new Toolbar({
		node: '#toolbar'
	});

	toolbar.callbacks.addTeam = function () {
		form.open({
			save: function (data) {
				return ajax('/admin/teams/create', data).then(function () {
					filter.save();
				});
			}
		});
	};
});