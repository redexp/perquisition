define('ajax', [
	'notify',
	'jquery'
], function (
	notify,
	$
) {

	return function ajax(url, data, cb) {
		if (typeof data === 'function') {
			cb = data;
			data = {};
		}

		data = data || {};

		var isFormData = data instanceof window.FormData;

		var p = $.ajax({
			type: 'POST',
			url: url,
			data: isFormData ? data : JSON.stringify(data),
			contentType: isFormData ? false : "application/json; charset=utf-8",
			processData: !isFormData,
			cache: false
		});

		if (cb) {
			p.then(cb);
		}

		p.fail(showErrorMessage);

		return p;
	};

	function showErrorMessage(e) {
		if (e.responseJSON && e.responseJSON.message) {
			notify.error(e.responseJSON.message);
		}
	}
});