define('views/course-form', [
	'view',
	'views/modal-form',
	'views/autocompleter',
	'serverData',
	'utils',
	'lang',
	'jquery'
], function (
	View,
	ModalForm,
	Autocompleter,
	serverData,
	utils,
	__,
	$
) {

	var users = serverData('users').reduce(function (hash, user) {
		hash[user.id] = user;
		return hash;
	}, {});

	function CourseForm(options) {
		var form = this;

		this.userNameAutocompleter = new Autocompleter({
			node: $(options.node).find('[data-user_name_autocompleter]').detach(),
			getList: function (data) {
				return form.callbacks.getUserNameList({
					name: data.value,
					offset: data.offset,
					limit: data.limit
				});
			},
			getItemTitle: function (user) {
				return user.name;
			}
		});

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

		ui: {
			userNameInput: '[data-user_name_input]'
		},

		getUserName: function () {
			return this.data.permission.id && (this.data.permission.id === '*' ? __('all') : users[this.data.permission.id].name);
		},

		removePermission: function () {
			this.parent.removePermission(this.data.permission);
		},

		openAutocompleter: function () {
			var permission = this.model('permission');

			this.parent.userNameAutocompleter.open({
				input: this.ui.userNameInput,
				change: function (user) {
					permission.set('id', user.id);
				},
				clear: function () {
					permission.set('id', '');
				}
			});
		},

		template: {
			'[data-user_name]': {
				text: function () {
					return this.getUserName();
				},

				visible: '=permission.id'
			},

			'[data-user_name_input]': {
				on: {
					'click': 'openAutocompleter'
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