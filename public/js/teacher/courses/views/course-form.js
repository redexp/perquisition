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

	users['*'] = {name: __('all_permission')};

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

			var users_permissions = course.users_permissions || {};

			var perms = utils.map(users_permissions, function (perm, id) {
				return {
					id: id,
					name: users[id].name,
					read: !!perm.read,
					write: !!perm.write
				};
			});

			perms.sort(function (a, b) {
				return a.id === '*' ? -1 : b.id === '*' ? 1 : a.id - b.id;
			});

			this.model('users_permissions').reset(perms);

			var form = this;

			setTimeout(function () {
				form.find('[name="title"]').focus();
			}, 200);
		});

		this.on('validate', function (data, errors) {
			if (!data.title.trim()) {
				errors.push('[data-user_name_required]');
			}

			this.views['[data-users_permissions]'].forEach(function (view) {
				view.trigger('validate', view.data.permission, errors);
			});
		});

		this.on('save', function (data) {
			data.users_permissions = this.data.users_permissions.reduce(function (hash, item) {
				hash[item.id] = {
					read: item.read,
					write: item.write
				};
				return hash;
			}, {});
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
				name: '',
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

		this.on('validate', function (data, errors) {
			if (!data.id) {
				errors.push({
					node: this.node.find('[data-user_name_required]')
				});
			}
		});
	}

	View.extend({
		constructor: Permission,

		ui: {
			userNameInput: '[data-user_name_input]'
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
				text: '=permission.name',
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
				},
				hidden: function () {
					return this.data.permission.id === '*';
				}
			}
		}
	});

	return CourseForm;
});