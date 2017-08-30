define('controllers/users', [
	'views/filter-form',
	'views/users-toolbar',
	'views/users-list',
	'views/paginator',
	'views/user-form',
	'ajax'
], function (
	FilterForm,
	UsersToolbar,
	UsersList,
	Paginator,
	UserForm,
	ajax
) {

	var filter = new FilterForm({
		node: '#filter-form',
		paginator: '#paginator',
		data: {
			roles: ['student']
		}
	});

	var users = new UsersList({
		node: '#users-list'
	});

	filter.callbacks.save = function (data, done) {
		ajax('/admin/users/search', data, function (res) {
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
				ajax('/admin/users/update', data, function () {
					filter.save();
				}).always(done);
			}
		});
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