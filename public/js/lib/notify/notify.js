define('notify', [
	'noty',
	'lang',
	'utils',
	'jquery'
], function (
	Noty,
	__,
    _,
	$
) {

	var notify = {
		windowInFocus: true,
		popupGranted: false,
		success: showSuccess,
		error: showError,
		close: close,
		confirm: confirm
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
			timeout: 4000
		});
	}

	function showError(text) {
		return showMessage(text, {
			type: 'error',
			args: _.rest(arguments),
			timeout: 10000
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
		var item = new Noty({
			type: ops.type,
			text: message,
			timeout: ops.timeout,
			animation: {
				close: null
			}
		});

		item.show();

		return item;
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

	function confirm(message) {
		var d = $.Deferred();

		var overlay = $('<div class="overlay">').appendTo('body');

		var dialog = new Noty({
			text: __(message, _.rest(arguments)),
			type: 'alert',
			layout: 'center',
			buttons: [
				Noty.button(__('ok'), 'btn btn-success m-r-sm', d.resolve),
				Noty.button(__('cancel'), 'btn btn-default', d.reject)
			],
			animation: {
				close: null
			}
		}).show();

		var p = d.promise();

		p.always(function () {
			dialog.close();
			overlay.remove();
		});

		return p;
	}

});