define('views/profile-form', [
	'views/registration-form'
], function (
	Form
) {

	function ProfileForm() {
		Form.apply(this, arguments);

		if (this.data.user.photo) {
			this.off('set/photoFile', this.initCropper);
			this.initCropper();
			this.cropper.croppie('bind', {
				url: '/student/photo/' + this.data.user.photo + '?' + Date.now(),
				zoom: 1
			});
		}

		this.off('validate');

		this.on('validate', function (data, errors) {
			if (!data.name.trim()) {
				errors.push('[data-name_required]');
			}

			if (data.password && data.password !== data.confirm_password) {
				errors.push('[data-password_invalid]');
			}
		});
	}

	Form.extend({
		constructor: ProfileForm,

		template: {
			'[data-email]': {
				text: '=user.username'
			},
			'[name="name"]': {
				prop: {
					'value': '=user.name'
				}
			}
		}
	});

	return ProfileForm;
});