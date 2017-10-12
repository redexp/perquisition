define('controllers/registration', [
	'views/registration-form',
	'ajax',
	'notify',
	'lang'
], function (
	RegistrationForm,
	ajax,
	notify,
	__
) {

	var form = new RegistrationForm({
		node: '#registration-form'
	});

	form.callbacks.save = function (data) {
		return form.getPhotoBlob()
			.then(function (blob) {
				data.photo = blob;
				return ajax('/registration', data);
			})
			.then(function (user) {
				var timeout = 2000;

				if (user && user.emailError) {
					notify.success(__('auth.saved_with_email_error'));
					timeout = 15000;
				}
				else {
					notify.success(__('main.saved'));
				}

				setTimeout(function () {
					location.href = '/?verify';
				}, timeout);
			})
		;
	};

});