define('controllers/courses', [
	'views/filter-form',
	'views/toolbar',
	'views/courses-list',
	'views/course-form',
	'store',
	'serverData',
	'ajax',
	'notify',
	'lang'
], function (
	FilterForm,
	Toolbar,
	CoursesList,
	CourseForm,
	store,
	serverData,
	ajax,
	notify,
	__
) {

	var filter = new FilterForm({
		node: '#filter-form',
		paginator: '#paginator'
	});

	var courses = new CoursesList({
		node: '#courses-list'
	});

	filter.callbacks.save = function (data) {
		data.permissions = true;

		return ajax('/teacher/courses/search', data).then(function (res) {
			courses.model('list').reset(res.rows);
			filter.paginator.set('count', res.count);
		});
	};

	filter.submit();

	var form = new CourseForm({
		node: '#course-form'
	});

	form.callbacks.getCourseUsers = function (course) {
		return ajax('/teacher/courses/users', {id: course.id});
	};

	form.callbacks.getCourseTeams = function (course) {
		return ajax('/teacher/courses/teams', {id: course.id});
	};

	form.callbacks.getUsersList = function (query) {
		return ajax('/teacher/courses/users/search', query);
	};

	form.callbacks.getTeamsList = function (query) {
		return ajax('/teacher/courses/teams/search', query);
	};

	var toolbar = new Toolbar({
		node: '#toolbar'
	});

	toolbar.callbacks.addCourse = function () {
		var course = {
			id: '',
			title: '',
			users_permissions: {},
			teams_permissions: {}
		};

		form.open({
			course: course,
			save: function (data) {
				return ajax('/teacher/courses/create', data).then(function () {
					filter.save();
				});
			}
		});
	};

	courses.callbacks.editCourse = function (course) {
		form.open({
			course: course,
			save: function (data) {
				data.id = course.id;

				return ajax('/teacher/courses/update', data).then(function () {
					courses.model('list').modelOf(course).set(data);
					notify.success(__('main.saved'));
				});
			}
		});
	};

	courses.callbacks.deleteCourse = function (course) {
		notify.confirm(__('confirm_delete'))
			.then(function () {
				return ajax('/teacher/course/delete', {id: course.id});
			})
			.then(function () {
				filter.save();
			})
		;
	};

});