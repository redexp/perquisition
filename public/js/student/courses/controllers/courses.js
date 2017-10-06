define('controllers/courses', [
	'views/courses-list',
	'serverData'
], function (
	CoursesList,
	serverData
) {

	var courses = new CoursesList({
		node: '#courses-list',
		data: {
			list: serverData('courses')
		}
	});
});