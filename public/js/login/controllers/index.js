define('controllers/index', [
	'views/login-form',
	'ajax',
	'notify',
	'lang'
], function (
	LoginForm,
	ajax,
	notify,
	__
) {

	var form = new LoginForm({
		node: '#login-form'
	});

	form.callbacks.save = function (data) {
		ajax('/login', data, function () {
			location.reload();
		});
	};

});