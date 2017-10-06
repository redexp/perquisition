define('views/courses-list', [
	'view'
], function (
	View
) {

	function CoursesList() {
		View.apply(this, arguments);
		this.callbacks = {};
	}

	View.extend({
		constructor: CoursesList,

		template: {
			'[data-list]': {
				each: {
					prop: 'list',
					view: Course,
					dataProp: 'course'
				}
			}
		}
	});

	function Course() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Course,

		template: {
			'[data-title]': {
				text: '=course.title'
			},

			'[data-status]': {
				visible: {
					'@course.status': function (status) {
						return function (node) {
							return node.attr('data-status') === status;
						};
					}
				}
			},

			'[data-link]': {
				attr: {
					'href': function () {
						return function (node) {
							return node.attr('href').replace(':id', this.data.course.id);
						};
					}
				}
			}
		}
	});

	return CoursesList;
});