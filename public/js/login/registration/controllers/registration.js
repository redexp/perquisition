define('controllers/registration', [
	'views/registration-form',
	'ajax',
	'notify'
], function (
	RegistrationForm,
	ajax,
	notify
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
				notify.success('main.saved');
				setTimeout(function () {
					location.href = '/?verify';
				}, 2000);
			})
		;
	};

});