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

	if (location.href.indexOf('verified') > -1) {
		notify.success(__('auth.verified'));
	}
	else if (location.href.indexOf('rejected') > -1) {
		notify.error(__('auth.rejected'));
	}

	var form = new LoginForm({
		node: '#login-form'
	});

	form.callbacks.save = function (data) {
		data.username = data.username.toLowerCase();

		return ajax('/login', data)
			.then(function () {
				location.reload();
			})
			.catch(function () {
				notify.error(__('auth.login_error'));
			})
		;
	};

});