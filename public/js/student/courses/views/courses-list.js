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
					dataProp: 'course',
					removeClass: 'hidden'
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
			'[data-online]': {
				visible: '@course.online'
			},
			'[data-offline]': {
				visible: '!@course.online'
			},

			'[data-title]': {
				text: '=course.title'
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