define('views/courses-list', [
	'view',
	'store'
], function (
	View,
	store
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

		this.on('@course.users_permissions', function () {
			this.set('read', this.hasPermission('read'));
			this.set('write', this.hasPermission('write'));
		});
	}

	View.extend({
		constructor: Course,

		data: {
			course: null,
			read: false,
			write: false
		},

		hasPermission: function (name) {
			var perms = this.get('course').users_permissions;
			var id = store.get('user').id;

			return !!(
				(perms && perms['*'] && perms['*'][name]) ||
				(perms && perms[id] && perms[id][name])
			);
		},

		editCourse: function () {
			this.parent.callbacks.editCourse(this.data.course);
		},

		deleteCourse: function () {
			this.parent.callbacks.deleteCourse(this.data.course);
		},

		template: {
			'[data-title]': {
				text: '@course.title'
			},

			'[data-edit]': {
				on: {
					'click': 'editCourse'
				}
			},

			'[data-delete]': {
				on: {
					'click': 'deleteCourse'
				}
			},

			'[data-edit], [data-edit_questions], [data-delete]': {
				hidden: '!=course.user_permission.write'
			}
		}
	});

	return CoursesList;
});