define('controllers/courses', [
	'views/courses-list',
	'views/course-form',
	'store',
	'serverData',
	'ajax',
	'lang'
], function (
	CoursesList,
	CourseForm,
	store,
	serverData,
	ajax,
	__
) {

	var courses = new CoursesList({
		node: '#courses-list',
		data: {
			list: serverData('courses')
		}
	});

	var form = new CourseForm({
		node: '#course-form'
	});

	courses.callbacks.addCourse = function () {
		var course = {
			title: '',
			users_permissions: {
				'*': {
					read: true,
					write: false
				}
			}
		};

		course.users_permissions[store.get('user').id] = {
			read: true,
			write: true
		};

		form.open({
			course: course,
			save: function (data, done) {
				ajax('/teacher/course/create', {course: data}, function (course) {
					courses.model('list').add(course);
					done();
				}).catch(done);
			}
		});
	};

	courses.callbacks.editCourse = function (course) {
		form.open({
			course: course,
			save: function (data, done) {
				data.id = course.id;
				data.user_id = course.user_id;

				ajax('/teacher/course/update', {course: data}, function () {
					courses.model('list').modelOf(course).set(data);
					done();
				}).catch(done);
			}
		});
	};

	courses.callbacks.removeCourse = function (course) {
		if (!confirm(__('confirm_delete'))) return;

		ajax('/teacher/course/delete', {id: course.id}, function () {
			courses.model('list').remove(course);
		});
	};

	form.callbacks.getUserNameList = function (data) {
		data.exclude = form.get('users_permissions')
			.filter(function (item) {
				return !!item.id && item.id !== '*';
			})
			.map(function (item) {
				return item.id;
			})
		;

		return ajax('/teacher/course/users', data);
	};

});