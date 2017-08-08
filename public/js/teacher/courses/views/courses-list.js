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

		data: function () {
			return {
				list: []
			};
		},

		addCourse: function () {
			this.callbacks.addCourse();
		},

		editCourse: function (course) {
			this.callbacks.editCourse(course);
		},

		removeCourse: function (course) {
			this.callbacks.removeCourse(course);
		},

		template: {
			'[data-list]': {
				each: {
					prop: 'list',
					view: Course,
					viewProp: 'course'
				}
			},

			'[data-add-course]': {
				on: {
					'click': 'addCourse'
				}
			}
		}
	});

	function Course() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Course,

		editCourse: function () {
			this.parent.editCourse(this.data.course);
		},

		removeCourse: function () {
			this.parent.removeCourse(this.data.course);
		},

		template: {
			'[data-title]': {
				text: '@course.title'
			},

			'[data-link]': {
				attr: {
					'href': function () {
						return function (link) {
							return link.attr('href').replace(':id', this.data.course.id);
						};
					}
				}
			},

			'[data-edit]': {
				on: {
					'click': '!editCourse'
				}
			},

			'[data-remove]': {
				on: {
					'click': '!removeCourse'
				}
			}
		}
	});

	return CoursesList;
});