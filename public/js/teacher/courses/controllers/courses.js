define('controllers/courses', [
	'views/courses-list',
	'views/course-form',
	'serverData',
	'ajax'
], function (
	CoursesList,
	CourseForm,
	serverData,
	ajax
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
				ajax('/teacher/add-course', {course: data}, function (course) {
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

				ajax('/teacher/update-course', {course: data}, function () {
					courses.model('list').modelOf(course).set(data);
					done();
				});
			}
		});
	};

	courses.callbacks.removeCourse = function (course) {
		ajax('/teacher/remove-course', {id: course.id}, function () {
			courses.model('list').remove(course);
		});
	};
});