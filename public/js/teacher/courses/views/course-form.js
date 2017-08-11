define('views/course-form', [
	'view',
	'views/modal-form',
	'serverData',
	'utils',
	'lang'
], function (
	View,
	ModalForm,
	serverData,
	utils,
	__
) {

	var users = serverData('users').reduce(function (hash, user) {
		hash[user.id] = user;
		return hash;
	}, {});

	function CourseForm() {
		ModalForm.apply(this, arguments);

		this.on('open', function (params) {
			var course = params.course || CourseForm.prototype.data().course;
			this.model('course').set(course);

			this.model('users_permissions').reset(utils.map(course.users_permissions || {}, function (perm, id) {
				return {
					id: id,
					read: !!perm.read,
					write: !!perm.write
				};
			}));
		});
	}

	ModalForm.extend({
		constructor: CourseForm,

		data: function () {
			return {
				course: {
					title: ''
				},
				users_permissions: []
			};
		},

		addPermission: function () {
			this.model('users_permissions').add({
				id: '',
				read: true,
				write: false
			});
		},

		removePermission: function (permission) {
			this.model('users_permissions').remove(permission);
		},

		template: function (extend) {
			return extend({},
				this.propValueTemplateOf('course'),
				{
					'[data-users_permissions]': {
						each: {
							prop: 'users_permissions',
							view: Permission,
							viewProp: 'permission'
						}
					},

					'[data-add_permission]': {
						on: {
							'click': 'addPermission'
						}
					}
				}
			);
		}
	});

	function Permission() {
		View.apply(this, arguments);
	}

	View.extend({
		constructor: Permission,

		getUserName: function () {
			return this.data.permission.id && (this.data.permission.id === '*' ? __('all') : users[this.data.permission.id].name);
		},

		removePermission: function () {
			this.parent.removePermission(this.data.permission);
		},

		template: {
			'[data-user_name]': {
				text: function () {
					return this.getUserName();
				},

				visible: '=permission.id'
			},

			'[data-user_name_input]': {
				prop: {
					'value': function () {
						return this.getUserName();
					}
				},

				visible: '!=permission.id'
			},

			'[data-permission="read"]': {
				connect: {
					'checked': 'permission.read'
				}
			},

			'[data-permission="write"]': {
				connect: {
					'checked': 'permission.write'
				}
			},

			'[data-remove_permission]': {
				on: {
					'click': 'removePermission'
				}
			}
		}
	});

	return CourseForm;
});