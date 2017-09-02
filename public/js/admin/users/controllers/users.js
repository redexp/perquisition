define('controllers/users', [
	'views/filter-form',
	'views/users-toolbar',
	'views/users-list',
	'views/paginator',
	'views/user-form',
	'ajax',
	'notify'
], function (
	FilterForm,
	UsersToolbar,
	UsersList,
	Paginator,
	UserForm,
	ajax,
	notify
) {

	var filter = new FilterForm({
		node: '#filter-form',
		paginator: '#paginator',
		data: {
			roles: ['student']
		}
	});

	filter.callbacks.getTeamsList = function (query) {
		return ajax('/admin/teams/search', query);
	};

	var users = new UsersList({
		node: '#users-list'
	});

	filter.callbacks.save = function (data, done) {
		data.teams = true;

		ajax('/admin/users/search', data).then(function (res) {
			users.model('list').reset(res.rows);
			filter.paginator.set('count', res.count);
		}).always(done);
	};

	filter.submit();

	var form = new UserForm({
		node: '#user-form'
	});

	form.callbacks.getTeamsList = function (query) {
		return ajax('/admin/teams/search', query);
	};

	users.callbacks.editUser = function (user) {
		form.open({
			user: user,
			save: function (data, done) {
				ajax('/admin/users/update', data).then(function () {
					users.modelOf(user).assign(data);
				}).always(done);
			}
		});
	};

	users.callbacks.deleteUser = function (user) {
		notify.confirm('confirm_delete_user', user.name)
			.then(function () {
				return ajax('/admin/users/delete', {id: user.id});
			})
			.then(function () {
				filter.save();
			})
		;
	};

	var toolbar = new UsersToolbar({
		node: '#users-toolbar'
	});

	toolbar.callbacks.addUser = function () {
		form.open({
			save: function (data, done) {
				ajax('/admin/users/create', data, function () {
					filter.save();
				}).always(done);
			}
		});
	};
});