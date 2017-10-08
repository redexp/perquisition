define('views/registration-form', [
	'views/form',
	'croppie'
], function (
	Form
) {

	function RegistrationForm() {
		Form.apply(this, arguments);

		this.once('set/photoFile', this.initCropper);
		this.on('set/photoFile', this.drawPhoto);

		this.on('validate', function (data, errors) {
			if (!/^.+@.+\..+$/.test(data.username)) {
				errors.push('[data-email_invalid]')
			}

			if (!data.name.trim()) {
				errors.push('[data-name_required]');
			}

			if (!data.password.trim() || data.password !== data.confirm_password) {
				errors.push('[data-password_invalid]');
			}

			if (!this.data.photoFile) {
				errors.push('[data-photo_required]');
			}
		});
	}

	Form.extend({
		constructor: RegistrationForm,

		ui: {
			cropper: '[data-cropper]'
		},

		data: function () {
			return {
				photoFile: null
			};
		},

		initCropper: function () {
			this.cropper = this.ui.cropper.croppie({
				viewport: {
					width: 100,
					height: 100,
					type: 'circle'
				},
				boundary: {
					width: 200,
					height: 200
				}
			});
		},

		drawPhoto: function () {
			var reader = new FileReader();
			var view = this;

			reader.onload = function (e) {
				view.cropper.croppie('bind', {
					url: e.target.result
				});
			};

			reader.readAsDataURL(this.data.photoFile);
		},

		getPhotoBlob: function () {
			return this.cropper.croppie('result', {
				type: 'blob',
				format: 'png',
				size: {width: 100, height: 100}
			});
		},

		template: {
			'[data-photo]': {
				on: {
					'change': function (e) {
						this.set('photoFile', e.target.files[0]);
					}
				}
			}
		}
	});

	return RegistrationForm;
});