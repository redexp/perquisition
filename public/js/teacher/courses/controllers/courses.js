define('controllers/courses', [
	'views/courses-list',
	'views/course-form',
	'serverData',
	'ajax',
	'lang'
], function (
	CoursesList,
	CourseForm,
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
		form.open({
			save: function (data, done) {
				ajax('/teacher/course/create', {course: data}, function (course) {
					courses.model('list').add(course);
					done();
				});
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
				});
			}
		});
	};

	courses.callbacks.removeCourse = function (course) {
		ajax('/teacher/course/delete', {id: course.id}, function () {
			courses.model('list').remove(course);
		});
	};

	form.callbacks.getUserNameList = function (data) {
		return ajax('/teacher/course/users', data).then(function (list) {
			if (data.name === '') {
				if (data.offset === 0) {
					list.rows = [{id: '*', name: __('all_permission')}].concat(list.rows.slice(0, 9));
				}

				list.count += 1;
			}

			return list;
		});
	};

});