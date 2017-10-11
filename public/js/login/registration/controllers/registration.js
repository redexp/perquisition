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
			.then(function () {
				notify.success(__('main.saved'));
				setTimeout(function () {
					location.href = '/?verify';
				}, 2000);
			})
		;
	};

});