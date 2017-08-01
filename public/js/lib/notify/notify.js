define('notify', [
	'noty',
	'lang',
	'utils',
	'jquery'
], function (
	toastr,
	__,
    _,
	$
) {

	var notify = {
		windowInFocus: true,
		popupGranted: false,
		success: showSuccess,
		error: showError,
		close: close
	};

	$(window)
		.focus(function () {
			notify.windowInFocus = true;
		})
		.blur(function () {
			notify.windowInFocus = false;
		})
	;

	if (window.Notification && window.Notification.requestPermission) {
		window.Notification.requestPermission(function (permission) {
			notify.popupGranted = permission === "granted";
		});
	}

	return notify;

	function showSuccess(text) {
		return showMessage(text, {
			type: 'success',
			args: _.rest(arguments),
			hideDuration: 100
		});
	}

	function showError(text) {
		return showMessage(text, {
			type: 'error',
			args: _.rest(arguments),
			timeOut: 10000,
			hideDuration: 100
		});
	}

	function showMessage(text, ops) {
		var args = ops.args;

		if (args.length > 0 && typeof args[args.length - 1] === 'object') {
			_.extend(ops, args.pop());
		}

		if (ops.internal || notify.windowInFocus || !notify.popupGranted) {
			return toast(__(text, args), ops);
		}
		else {
			return popup(__(text, args), ops);
		}
	}

	function toast(message, ops) {
		var el = toastr[ops.type](message, ops.title || null, ops);

		if (ops.image) {
			el.css({
				'backgroundImage': 'url("' + ops.image +'")',
				'backgroundSize': '28px'
			});
		}

		return el;
	}

	function popup(message, ops) {
	    return new window.Notification(ops.title || '', {
			icon: ops.image || '/img/popup-' + ops.type + '.png',
			body: message
		});
	}

	function close(message) {
	    if (message instanceof window.Notification && message.close) {
			message.close();
		}
		else if (message instanceof $) {
			message.remove();
		}
	}

});